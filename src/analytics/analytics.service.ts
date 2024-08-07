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
  PassengerCounts,
  AverageFlightsPerDay,
  SeatOccupancyRates,
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
          EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600 AS duration_hours,
          RANK() OVER (PARTITION BY f.airline ORDER BY EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) DESC) AS rank_desc,
          RANK() OVER (PARTITION BY f.airline ORDER BY EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) ASC) AS rank_asc,
          f.origin_airport_id,
          f.destination_airport_id
        FROM 
          "Flight" f
      )
      SELECT
        rf.airline,
        rf.flight_id,
        rf.flight_number,
        rf.duration_hours,
        rf.rank_desc,
        rf.rank_asc,
        orig_airport.name AS origin_airport_name,
        dest_airport.name AS destination_airport_name
      FROM
        ranked_flights rf
      JOIN
        "Airport" orig_airport ON rf.origin_airport_id = orig_airport.airport_id
      JOIN
        "Airport" dest_airport ON rf.destination_airport_id = dest_airport.airport_id
      WHERE 
        rf.rank_desc = 1
        OR rf.rank_asc = 1;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      duration_hours: Number(row.duration_hours),
      rank_desc: Number(row.rank_desc),
      rank_asc: Number(row.rank_asc),
    }));

    return formattedResult;
  }

  async getPassengerCounts(): Promise<PassengerCounts[]> {
    const result = await this.prisma.$queryRaw<PassengerCounts[]>`
      SELECT 
        f.flight_id,
        f.flight_number,
        COUNT(bd.passenger_id) AS total_passengers,
        AVG(COUNT(bd.passenger_id)) OVER () AS avg_passengers,
        COUNT(bd.passenger_id) - AVG(COUNT(bd.passenger_id)) OVER () AS difference_from_avg
      FROM 
        "Flight" f
      JOIN 
        "BookingDetail" bd ON f.flight_id = bd.flight_id
      GROUP BY 
        f.flight_id
      ORDER BY
        difference_from_avg DESC;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      total_passengers: Number(row.total_passengers),
      avg_passengers: Number(row.avg_passengers),
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

  async getSeatOccupancyRates(): Promise<SeatOccupancyRates[]> {
    const result = await this.prisma.$queryRaw<SeatOccupancyRates[]>`
      SELECT 
        f.flight_id,
        f.flight_number,
        SUM(CASE WHEN s.available = false THEN 1 ELSE 0 END) * 1.0 / COUNT(s.seat_id) AS seat_occupancy_rate
      FROM 
        "Flight" f
      JOIN 
        "Seat" s ON f.flight_id = s.flight_id
      GROUP BY 
        f.flight_id;
    `;

    // Convertir BigInt a Number
    const formattedResult = result.map((row) => ({
      ...row,
      seat_occupancy_rate: Number(row.seat_occupancy_rate),
    }));

    return formattedResult;
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
