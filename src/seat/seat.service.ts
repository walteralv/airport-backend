// src/seat/seat.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async selectSeat(seatId: number) {
    const seat = await this.prisma.seat.findUnique({
      where: { seat_id: seatId },
    });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${seatId} not found`);
    }

    if (!seat.available) {
      throw new BadRequestException(`Seat with ID ${seatId} is not available`);
    }

    const updatedSeat = await this.prisma.seat.update({
      where: { seat_id: seatId },
      data: { available: false },
    });

    return {
      seatId: updatedSeat.seat_id,
      seatNumber: updatedSeat.seat_number,
      class: updatedSeat.class,
      seatType: updatedSeat.seat_type,
      price: {
        amount: updatedSeat.price,
        currency: 'USD',
      },
      available: updatedSeat.available,
    };
  }

  async create(data: CreateSeatDto) {
    return this.prisma.seat.create({ data });
  }

  async getSeatsForFlight(flightId: number) {
    console.log(`Fetching seats for flight ID: ${flightId}`);

    const seats = await this.prisma.seat.findMany({
      where: {
        flight_id: flightId,
      },
      include: {
        flight: {
          include: {
            origin_airport: true,
            destination_airport: true,
          },
        },
      },
    });

    console.log(`Found ${seats.length} seats for flight ID: ${flightId}`);

    const zones = this.calculateZones(seats);

    const seatsData = seats.map((seat) => ({
      seatId: seat.seat_id,
      seatNumber: seat.seat_number,
      class: seat.class,
      seatType: seat.seat_type,
      available: seat.available,
      price: {
        amount: seat.price,
        currency: 'USD',
      },
    }));

    console.log('Processed seat data:', seatsData);
    console.log('Calculated zones:', zones);

    const result = {
      seats: seatsData,
      zones: zones,
      fullSegment: seats.length === 0,
    };

    console.log('Returning result:', result);
    return result;
  }

  async getSeatsByFlightId(flightId: number) {
    const seats = await this.prisma.seat.findMany({
      where: {
        flight_id: Number(flightId),
      },
      include: {
        flight: {
          include: {
            origin_airport: true,
            destination_airport: true,
          },
        },
      },
    });

    const zones = this.calculateZones(seats);

    const seatsData = seats.map((seat) => ({
      seatNumber: seat.seat_number,
      class: seat.class,
      seatType: seat.seat_type,
      available: seat.available,
      price: {
        amount: seat.price,
        currency: 'USD', // Assuming all prices are in USD
      },
    }));

    return {
      seats: seatsData,
      zones: zones,
      fullSegment: false,
    };
  }

  private calculateZones(seats: any[]) {
    const zoneMap = {};

    seats.forEach((seat) => {
      const zone = seat.class;
      if (!zoneMap[zone]) {
        zoneMap[zone] = {
          zoneCode: zone.toUpperCase().replace(' ', '_'),
          minPrice: {
            amount: seat.price,
            currency: 'USD',
          },
          availableZone: seat.available,
        };
      } else {
        if (seat.price < zoneMap[zone].minPrice.amount) {
          zoneMap[zone].minPrice.amount = seat.price;
        }
        if (seat.available) {
          zoneMap[zone].availableZone = true;
        }
      }
    });

    return Object.values(zoneMap);
  }

  async findAll() {
    return this.prisma.seat.findMany();
  }

  async findOne(id: number) {
    return this.prisma.seat.findUnique({ where: { seat_id: id } });
  }

  async update(id: number, data: UpdateSeatDto) {
    return this.prisma.seat.update({ where: { seat_id: id }, data });
  }

  async remove(id: number) {
    return this.prisma.seat.delete({ where: { seat_id: id } });
  }

  async getAvailableSeatsForFlight(flightId: number) {
    const seats = await this.prisma.seat.findMany({
      where: {
        flight_id: flightId,
        available: true,
      },
      include: {
        flight: {
          include: {
            origin_airport: true,
            destination_airport: true,
          },
        },
      },
    });

    const zones = this.calculateZones(seats);

    const seatsData = seats.map((seat) => ({
      seatId: seat.seat_id,
      seatNumber: seat.seat_number,
      class: seat.class,
      seatType: seat.seat_type,
      price: {
        amount: seat.price,
        currency: 'USD',
      },
    }));

    return {
      seats: seatsData,
      zones: zones,
      fullSegment: seats.length === 0,
    };
  }
}
