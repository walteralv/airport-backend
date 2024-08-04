// src/airport/airport.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { CreateAirportDto } from './dto/create-airport.dto';

@Injectable()
export class AirportService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAirportDto) {
    return this.prisma.airport.create({ data });
  }

  async findAll() {
    return this.prisma.airport.findMany();
  }

  async findOne(id: number) {
    return this.prisma.airport.findUnique({ where: { airport_id: id } });
  }

  async update(id: number, data: UpdateAirportDto) {
    return this.prisma.airport.update({ where: { airport_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.airport.delete({ where: { airport_id: id } });
  }
}
