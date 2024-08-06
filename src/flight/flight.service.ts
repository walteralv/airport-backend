// src/flight/flight.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFlightDto) {
    return this.prisma.flight.create({ data });
  }

  async findAll() {
    return this.prisma.flight.findMany();
  }

  async findOne(id: number) {
    return this.prisma.flight.findUnique({ where: { flight_id: id } });
  }

  async searchFlights(searchFlightsDto: SearchFlightsDto) {
    const {
      origin_airport_code,
      destination_airport_code,
      departure_date,
      return_date,
    } = searchFlightsDto;

    console.log('Search DTO:', searchFlightsDto);

    const [originAirport, destinationAirport] = await Promise.all([
      this.prisma.airport.findFirst({
        where: { IATA_code: origin_airport_code },
        select: { airport_id: true },
      }),
      this.prisma.airport.findFirst({
        where: { IATA_code: destination_airport_code },
        select: { airport_id: true },
      }),
    ]);

    if (!originAirport) {
      throw new NotFoundException(
        `Origin airport with IATA code ${origin_airport_code} not found`,
      );
    }
    if (!destinationAirport) {
      throw new NotFoundException(
        `Destination airport with IATA code ${destination_airport_code} not found`,
      );
    }

    const [outboundFlights, returnFlights] = await Promise.all([
      this.findFlights(
        originAirport.airport_id,
        destinationAirport.airport_id,
        departure_date,
      ),
      return_date
        ? this.findFlights(
            destinationAirport.airport_id,
            originAirport.airport_id,
            return_date,
          )
        : Promise.resolve([]),
    ]);

    console.log('Outbound flights found:', outboundFlights.length);
    console.log('Return flights found:', returnFlights.length);

    return { outboundFlights, returnFlights };
  }

  private async findFlights(
    originId: number,
    destinationId: number,
    date: string,
  ) {
    console.log('Finding flights with params:', {
      originId,
      destinationId,
      date,
    });
    return this.prisma.flight.findMany({
      where: {
        origin_airport_id: originId,
        destination_airport_id: destinationId,
        departure_time: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        },
      },
      include: {
        origin_airport: true,
        destination_airport: true,
        StopOvers: {
          include: {
            airport: true,
          },
        },
        FlightFares: {
          include: {
            fare: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateFlightDto) {
    return this.prisma.flight.update({ where: { flight_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.flight.delete({ where: { flight_id: id } });
  }
}
