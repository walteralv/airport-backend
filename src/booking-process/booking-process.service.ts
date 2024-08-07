import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingProcessService {
  constructor(private prisma: PrismaService) {}

  async processBooking(bookingData: {
    flightId: number;
    seats: number[];
    passengers: {
      firstName: string;
      lastName: string;
      passportNumber: string;
      nationality: string;
      phone: string;
      email: string;
    }[];
    baggageOptionId: number;
  }) {
    const { flightId, seats, passengers, baggageOptionId } = bookingData;

    if (seats.length !== passengers.length) {
      throw new BadRequestException(
        'El número de asientos debe coincidir con el número de pasajeros',
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      // Verificar disponibilidad de asientos y actualizarlos
      for (const seatId of seats) {
        const seat = await prisma.seat.findUnique({
          where: { seat_id: seatId },
        });
        if (!seat || !seat.available) {
          throw new BadRequestException(
            `El asiento ${seatId} no está disponible`,
          );
        }
        await prisma.seat.update({
          where: { seat_id: seatId },
          data: { available: false },
        });
      }

      // Calcular precio total (suma de precios de asientos)
      const seatPrices = await prisma.seat.findMany({
        where: { seat_id: { in: seats } },
        select: { price: true },
      });
      const totalPrice = seatPrices.reduce(
        (sum, seat) => sum + seat.price.toNumber(),
        0,
      );

      // Crear la reserva
      const booking = await prisma.booking.create({
        data: {
          booking_date: new Date(),
          total_price: totalPrice,
          status: 'confirmed',
        },
      });

      // Procesar pasajeros y crear detalles de reserva
      for (let i = 0; i < passengers.length; i++) {
        const passengerData: Prisma.PassengerCreateInput = {
          first_name: passengers[i].firstName,
          last_name: passengers[i].lastName,
          passport_number: passengers[i].passportNumber,
          nationality: passengers[i].nationality,
          phone: passengers[i].phone,
          email: passengers[i].email,
        };

        const passenger = await prisma.passenger.upsert({
          where: { passport_number: passengers[i].passportNumber },
          update: passengerData,
          create: passengerData,
        });

        await prisma.bookingDetail.create({
          data: {
            booking: { connect: { booking_id: booking.booking_id } },
            passenger: { connect: { passenger_id: passenger.passenger_id } },
            flight: { connect: { flight_id: flightId } },
            seat: { connect: { seat_id: seats[i] } },
            baggage: { connect: { baggage_id: baggageOptionId } },
          },
        });
      }

      return {
        bookingId: booking.booking_id,
        totalPrice: booking.total_price,
        status: booking.status,
      };
    });
  }

  async getBookingSummary(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: {
        BookingDetails: {
          include: {
            passenger: true,
            seat: true,
            flight: {
              include: {
                origin_airport: true,
                destination_airport: true,
              },
            },
            baggage: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    return {
      bookingId: booking.booking_id,
      bookingDate: booking.booking_date,
      totalPrice: booking.total_price,
      status: booking.status,
      passengers: booking.BookingDetails.map((detail) => ({
        firstName: detail.passenger.first_name,
        lastName: detail.passenger.last_name,
        passportNumber: detail.passenger.passport_number,
        seat: detail.seat.seat_number,
        baggage: detail.baggage.type,
      })),
      flight: {
        flightNumber: booking.BookingDetails[0].flight.flight_number,
        origin: booking.BookingDetails[0].flight.origin_airport.name,
        destination: booking.BookingDetails[0].flight.destination_airport.name,
        departureTime: booking.BookingDetails[0].flight.departure_time,
        arrivalTime: booking.BookingDetails[0].flight.arrival_time,
      },
    };
  }
}
