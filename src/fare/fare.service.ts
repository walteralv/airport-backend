// src/fare/fare.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFareDto } from './dto/create-fare.dto';
import { UpdateFareDto } from './dto/update-fare.dto';

@Injectable()
export class FareService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFareDto) {
    return this.prisma.fare.create({ data });
  }

  async findAll() {
    return this.prisma.fare.findMany();
  }

  async findOne(id: number) {
    return this.prisma.fare.findUnique({ where: { fare_id: id } });
  }

  async update(id: number, data: UpdateFareDto) {
    return this.prisma.fare.update({ where: { fare_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.fare.delete({ where: { fare_id: id } });
  }
}
