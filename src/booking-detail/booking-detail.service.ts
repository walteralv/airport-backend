import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingDetail } from '@prisma/client';
import { UpdateBookingDetailDto } from './dto/update-booking-detail.dto';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';

@Injectable()
export class BookingDetailService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDetailDto): Promise<BookingDetail> {
    return this.prisma.bookingDetail.create({
      data,
    });
  }

  async findAll(): Promise<BookingDetail[]> {
    return this.prisma.bookingDetail.findMany();
  }

  async findOne(id: number): Promise<BookingDetail> {
    return this.prisma.bookingDetail.findUnique({
      where: { booking_detail_id: id },
    });
  }

  async update(
    id: number,
    data: UpdateBookingDetailDto,
  ): Promise<BookingDetail> {
    return this.prisma.bookingDetail.update({
      where: { booking_detail_id: id },
      data,
    });
  }

  async remove(id: number): Promise<BookingDetail> {
    return this.prisma.bookingDetail.delete({
      where: { booking_detail_id: id },
    });
  }
}
