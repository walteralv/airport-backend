// src/booking/booking.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDto) {
    return this.prisma.booking.create({ data });
  }

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: number) {
    return this.prisma.booking.findUnique({ where: { booking_id: id } });
  }

  async update(id: number, data: UpdateBookingDto) {
    return this.prisma.booking.update({ where: { booking_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.booking.delete({ where: { booking_id: id } });
  }
}
