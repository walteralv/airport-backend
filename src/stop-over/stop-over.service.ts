// src/stopover/stopover.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStopOverDto } from './dto/create-stop-over.dto';
import { UpdateStopOverDto } from './dto/update-stop-over.dto';

@Injectable()
export class StopOverService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStopOverDto) {
    return this.prisma.stopOver.create({ data });
  }

  async findAll() {
    return this.prisma.stopOver.findMany();
  }

  async findOne(id: number) {
    return this.prisma.stopOver.findUnique({ where: { stop_id: id } });
  }

  async update(id: number, data: UpdateStopOverDto) {
    return this.prisma.stopOver.update({ where: { stop_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.stopOver.delete({ where: { stop_id: id } });
  }
}
