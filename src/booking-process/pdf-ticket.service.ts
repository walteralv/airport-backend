import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfTicketService {
  constructor(private prisma: PrismaService) {}

  async generateTicketPdf(bookingId: number): Promise<Buffer> {
    const bookingData = await this.getBookingData(bookingId);

    // Usar una ruta relativa al directorio raíz del proyecto
    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'templates',
      'ticket.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    const html = template(bookingData);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }

  private async getBookingData(bookingId: number) {
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
      throw new Error(`Booking with ID ${bookingId} not found`);
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
