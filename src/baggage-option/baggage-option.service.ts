// src/baggage-option/baggage-option.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBaggageOptionDto } from './dto/create-baggage-option.dto';
import { UpdateBaggageOptionDto } from './dto/update-baggage-option.dto';

@Injectable()
export class BaggageOptionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBaggageOptionDto) {
    return this.prisma.baggageOption.create({ data });
  }

  async findAll() {
    return this.prisma.baggageOption.findMany();
  }

  async findOne(id: number) {
    return this.prisma.baggageOption.findUnique({ where: { baggage_id: id } });
  }

  async update(id: number, data: UpdateBaggageOptionDto) {
    return this.prisma.baggageOption.update({ where: { baggage_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.baggageOption.delete({ where: { baggage_id: id } });
  }
}
