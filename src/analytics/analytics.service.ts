import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AirportRanking,
  CountryFlightRanking,
  FlightStatusCounts,
  WeeklyFlightCounts,
  BookingStatusCounts,
  AverageArrivalTimes,
  LongestAndShortestFlights,
  SeatCounts,
  AverageFlightsPerDay,
  SeatOccupancyAnalytics,
  SeatOccupancyRate,
  AverageLayoverTimes,
  FlightsBelowAveragePrice,
} from './types/types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAirportRanking(): Promise<AirportRanking[]> {
    const result = await this.prisma.$queryRaw<AirportRanking[]>`
      SELECT 
        a.airport_id, 
        a.name AS airport_name,
        COUNT(f.flight_id) AS num_flights,
        RANK() OVER (ORDER BY COUNT(f.flight_id) DESC) AS rank
      FROM 
        "Airport" a
      JOIN 
        "Flight" f ON a.airport_id = f.origin_airport_id
      GROUP BY 
        a.airport_id, a.name;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      num_flights: Number(row.num_flights),
      rank: Number(row.rank),
    }));

    return formattedResult;
  }

  async getAverageArrivalTimes(): Promise<AverageArrivalTimes[]> {
    const result = await this.prisma.$queryRaw<AverageArrivalTimes[]>`
      SELECT 
        f.airline, 
        AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600) AS avg_duration_hours,
        AVG(AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600)) OVER () AS overall_avg_duration_hours,
        AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600) - AVG(AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600)) OVER () AS difference_from_avg
      FROM 
        "Flight" f
      GROUP BY 
        f.airline;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      avg_duration_hours: Number(row.avg_duration_hours),
      overall_avg_duration_hours: Number(row.overall_avg_duration_hours),
      difference_from_avg: Number(row.difference_from_avg),
    }));

    return formattedResult;
  }

  async getLongestAndShortestFlights(): Promise<LongestAndShortestFlights[]> {
    const result = await this.prisma.$queryRaw<LongestAndShortestFlights[]>`
      WITH ranked_flights AS (
        SELECT 
          f.airline,
          f.flight_id,
          f.flight_number,
          f.duration,
          f.origin_airport_id,
          f.destination_airport_id,
          CASE 
            WHEN ROW_NUMBER() OVER (ORDER BY f.duration DESC) <= 10 THEN 'longest'
            WHEN ROW_NUMBER() OVER (ORDER BY f.duration ASC) <= 10 THEN 'shortest'
          END AS flight_type
        FROM 
          "Flight" f
        WHERE
          f.status NOT IN ('Delayed', 'Cancelled')
      )
      SELECT
        rf.airline,
        rf.flight_id,
        rf.flight_number,
        rf.duration,
        orig_airport.name AS origin_airport_name,
        dest_airport.name AS destination_airport_name,
        rf.flight_type
      FROM
        ranked_flights rf
      JOIN
        "Airport" orig_airport ON rf.origin_airport_id = orig_airport.airport_id
      JOIN
        "Airport" dest_airport ON rf.destination_airport_id = dest_airport.airport_id
      WHERE 
        rf.flight_type IS NOT NULL
      ORDER BY
        CASE WHEN rf.flight_type = 'longest' THEN rf.duration END DESC,
        CASE WHEN rf.flight_type = 'shortest' THEN rf.duration END ASC;
    `;

    return result;
  }

  async getPassengerCounts(): Promise<SeatCounts[]> {
    const result = await this.prisma.$queryRaw<SeatCounts[]>`
      SELECT 
        f.flight_id,
        f.flight_number,
        COUNT(s.seat_id) FILTER (WHERE s.available = false) AS total_occupied_seats,
        AVG(COUNT(s.seat_id) FILTER (WHERE s.available = false)) OVER () AS avg_occupied_seats,
        COUNT(s.seat_id) FILTER (WHERE s.available = false) - 
          AVG(COUNT(s.seat_id) FILTER (WHERE s.available = false)) OVER () AS difference_from_avg
      FROM 
        "Flight" f
      JOIN 
        "Seat" s ON f.flight_id = s.flight_id
      WHERE
        f.status = 'completed'
      GROUP BY 
        f.flight_id
      ORDER BY
        difference_from_avg DESC;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      total_occupied_seats: Number(row.total_occupied_seats),
      avg_occupied_seats: Number(row.avg_occupied_seats),
      difference_from_avg: Number(row.difference_from_avg),
    }));

    return formattedResult;
  }

  async getAverageFlightsPerDay(): Promise<AverageFlightsPerDay[]> {
    const result = await this.prisma.$queryRaw<AverageFlightsPerDay[]>`
      SELECT 
        departure_time::date AS departure_date,
        COUNT(flight_id) AS num_flights,
        AVG(COUNT(flight_id)) OVER (ORDER BY departure_time::date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7_days
      FROM
        "Flight" 
      GROUP BY 
        departure_date
      ORDER BY 
        departure_date;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      num_flights: Number(row.num_flights),
      moving_avg_7_days: Number(row.moving_avg_7_days),
    }));

    return formattedResult;
  }

  async getSeatOccupancyRates(): Promise<SeatOccupancyAnalytics> {
    const result = await this.prisma.$queryRaw<SeatOccupancyRate[]>`
      SELECT 
        f.flight_id,
        f.flight_number,
        SUM(CASE WHEN s.available = false THEN 1 ELSE 0 END) * 1.0 / COUNT(s.seat_id) AS seat_occupancy_rate
      FROM 
        "Flight" f
      JOIN 
        "Seat" s ON f.flight_id = s.flight_id
      GROUP BY 
        f.flight_id
      HAVING 
        SUM(CASE WHEN s.available = false THEN 1 ELSE 0 END) * 1.0 / COUNT(s.seat_id) > 0
      ORDER BY
        seat_occupancy_rate DESC;
    `;

    // Convertir BigInt a Number y calcular el promedio total
    let totalOccupancy = 0;
    const formattedResult = result.map((row) => {
      const occupancyRate = Number(row.seat_occupancy_rate);
      totalOccupancy += occupancyRate;
      return {
        ...row,
        seat_occupancy_rate: occupancyRate,
      };
    });

    const averageOccupancyRate =
      formattedResult.length > 0 ? totalOccupancy / formattedResult.length : 0;

    return {
      flights: formattedResult,
      average_occupancy_rate: Number(averageOccupancyRate.toFixed(4)),
    };
  }

  async getAverageLayoverTimes(): Promise<AverageLayoverTimes[]> {
    const result = await this.prisma.$queryRaw<AverageLayoverTimes[]>`
      SELECT 
        f.flight_id,
        f.flight_number,
        orig_airport.name AS origin_airport_name,
        dest_airport.name AS destination_airport_name,
        AVG(s.layover_duration) AS avg_layover_duration_minutes
      FROM 
        "Flight" f
      JOIN 
        "StopOver" s ON f.flight_id = s.flight_id
      JOIN 
        "Airport" orig_airport ON f.origin_airport_id = orig_airport.airport_id
      JOIN 
        "Airport" dest_airport ON f.destination_airport_id = dest_airport.airport_id
      GROUP BY 
        f.flight_id,
        f.flight_number,
        orig_airport.name,
        dest_airport.name;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      avg_layover_duration_minutes: Number(row.avg_layover_duration_minutes),
    }));

    return formattedResult;
  }

  async getFlightsBelowAveragePrice(): Promise<FlightsBelowAveragePrice[]> {
    const result = await this.prisma.$queryRaw<FlightsBelowAveragePrice[]>`
      WITH AverageFlightPrice AS (
          SELECT
              AVG(ff.price) AS average_price
          FROM
              "FlightFare" ff
      )
      SELECT
          f.flight_number,
          f.airline,
          ff.price,
          afp.average_price,
          RANK() OVER (PARTITION BY f.flight_number ORDER BY ff.price DESC) AS rank_desc
      FROM
          "Flight" f
          JOIN "FlightFare" ff ON f.flight_id = ff.flight_id
          CROSS JOIN AverageFlightPrice afp
      WHERE
          ff.price < afp.average_price
      ORDER BY
          ff.price DESC;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      price: Number(row.price),
      average_price: Number(row.average_price),
      rank_desc: Number(row.rank_desc),
    }));

    return formattedResult;
  }

  async getCountryFlightRanking(): Promise<CountryFlightRanking[]> {
    const result = await this.prisma.$queryRaw<CountryFlightRanking[]>`
      WITH OriginFlightCounts AS (
          SELECT
              a.country,
              COUNT(f.flight_id) AS outbound_flights
          FROM
              "Flight" f
              JOIN "Airport" a ON f.origin_airport_id = a.airport_id
          GROUP BY
              a.country
      ),
      DestinationFlightCounts AS (
          SELECT
              a.country,
              COUNT(f.flight_id) AS inbound_flights
          FROM
              "Flight" f
              JOIN "Airport" a ON f.destination_airport_id = a.airport_id
          GROUP BY
              a.country
      ),
      TotalFlightCounts AS (
          SELECT
              o.country,
              COALESCE(o.outbound_flights, 0) AS outbound_flights,
              COALESCE(d.inbound_flights, 0) AS inbound_flights,
              COALESCE(o.outbound_flights, 0) + COALESCE(d.inbound_flights, 0) AS total_flights
          FROM
              OriginFlightCounts o
          FULL OUTER JOIN
              DestinationFlightCounts d ON o.country = d.country
      ),
      RankedFlightCounts AS (
          SELECT
              country,
              outbound_flights,
              inbound_flights,
              total_flights,
              RANK() OVER (ORDER BY total_flights DESC, outbound_flights DESC, inbound_flights DESC) AS rank_desc
          FROM
              TotalFlightCounts
      )
      SELECT
          country,
          outbound_flights,
          inbound_flights,
          total_flights,
          rank_desc
      FROM
          RankedFlightCounts
      ORDER BY
          rank_desc;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      outbound_flights: Number(row.outbound_flights),
      inbound_flights: Number(row.inbound_flights),
      total_flights: Number(row.total_flights),
      rank_desc: Number(row.rank_desc),
    }));

    return formattedResult;
  }

  async getBookingStatusCounts(): Promise<BookingStatusCounts[]> {
    const result = await this.prisma.$queryRaw<BookingStatusCounts[]>`
      WITH BookingStatusCounts AS (
        SELECT
          status,
          COUNT(booking_id) AS count
        FROM
          "Booking"
        GROUP BY
          status
      )
      SELECT
        status,
        count
      FROM
        BookingStatusCounts
      ORDER BY
        count DESC;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      count: Number(row.count),
    }));

    return formattedResult;
  }

  async getWeeklyFlightCounts(): Promise<WeeklyFlightCounts[]> {
    const result = await this.prisma.$queryRaw<WeeklyFlightCounts[]>`
      WITH WeeklyFlights AS (
        SELECT
          DATE_TRUNC('week', f.departure_time) AS week_start
        FROM
          "Flight" f
      ),
      WeeklyFlightsCount AS (
        SELECT
          week_start,
          COUNT(*) AS flight_count
        FROM
          WeeklyFlights
        GROUP BY
          week_start
        ORDER BY
          week_start
      ),
      WeeklyFlightsWithEnd AS (
        SELECT
          week_start,
          LEAD(week_start) OVER (ORDER BY week_start) - INTERVAL '1 day' AS week_end,
          flight_count
        FROM
          WeeklyFlightsCount
      )
      SELECT
        week_start::date AS week_start,
        COALESCE(week_end::date, (week_start + INTERVAL '6 days')::date) AS week_end,
        flight_count
      FROM
        WeeklyFlightsWithEnd
      ORDER BY
        week_start;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      flight_count: Number(row.flight_count),
    }));

    return formattedResult;
  }

  async getFlightStatusCounts(): Promise<FlightStatusCounts[]> {
    const result = await this.prisma.$queryRaw<FlightStatusCounts[]>`
      WITH FlightStatusCounts AS (
        SELECT
          f.status,
          COUNT(f.status) AS count
        FROM
          "Flight" f
        GROUP BY
          f.status
      )
      SELECT
        status,
        count
      FROM
        FlightStatusCounts
      ORDER BY
        count DESC;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      count: Number(row.count),
    }));

    return formattedResult;
  }
}
