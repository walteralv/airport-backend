import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(private prisma: PrismaService) {}

  async createOrFind(data: CreatePassengerDto) {
    const existingPassenger = await this.prisma.passenger.findFirst({
      where: {
        OR: [{ email: data.email }, { passport_number: data.passport_number }],
      },
    });

    if (existingPassenger) {
      return existingPassenger;
    }

    return this.prisma.passenger.create({ data });
  }

  async findAll() {
    return this.prisma.passenger.findMany();
  }

  async findOne(id: number) {
    const passenger = await this.prisma.passenger.findUnique({
      where: { passenger_id: id },
    });
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }

  async update(id: number, data: UpdatePassengerDto) {
    try {
      return await this.prisma.passenger.update({
        where: { passenger_id: id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Passenger with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.passenger.delete({
        where: { passenger_id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Passenger with ID ${id} not found`);
      }
      throw error;
    }
  }
}
