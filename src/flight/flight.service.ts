// src/flight/flight.service.ts
import { Injectable } from '@nestjs/common';
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
      origin_airport_id,
      destination_airport_id,
      departure_date,
      return_date,
    } = searchFlightsDto;

    const outboundFlights = await this.prisma.flight.findMany({
      where: {
        origin_airport_id: Number(origin_airport_id),
        destination_airport_id: Number(destination_airport_id),
        departure_time: {
          gte: new Date(`${departure_date}T00:00:00.000Z`),
          lte: new Date(`${departure_date}T23:59:59.999Z`),
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

    let returnFlights = [];
    if (return_date) {
      returnFlights = await this.prisma.flight.findMany({
        where: {
          origin_airport_id: Number(destination_airport_id),
          destination_airport_id: Number(origin_airport_id),
          departure_time: {
            gte: new Date(`${return_date}T00:00:00.000Z`),
            lte: new Date(`${return_date}T23:59:59.999Z`),
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

    return { outboundFlights, returnFlights };
  }

  async update(id: number, data: UpdateFlightDto) {
    return this.prisma.flight.update({ where: { flight_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.flight.delete({ where: { flight_id: id } });
  }
}
