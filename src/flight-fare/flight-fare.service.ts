// src/flight-fare/flight-fare.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightFareDto } from './dto/create-flight-fare.dto';
import { UpdateFlightFareDto } from './dto/update-flight-fare.dto';

@Injectable()
export class FlightFareService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFlightFareDto) {
    return this.prisma.flightFare.create({ data });
  }

  async findAll() {
    return this.prisma.flightFare.findMany();
  }

  async findOne(id: number) {
    return this.prisma.flightFare.findUnique({ where: { flight_fare_id: id } });
  }

  async update(id: number, data: UpdateFlightFareDto) {
    return this.prisma.flightFare.update({
      where: { flight_fare_id: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.flightFare.delete({ where: { flight_fare_id: id } });
  }
}
