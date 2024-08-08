import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingProcessService } from './booking-process.service';
import { PdfTicketService } from './pdf-ticket.service';
import { Response } from 'express';

@ApiTags('booking-process')
@Controller('booking-process')
export class BookingProcessController {
  constructor(
    private readonly bookingProcessService: BookingProcessService,
    private readonly pdfTicketService: PdfTicketService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Process a complete booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully processed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async processBooking(@Body() bookingData: any) {
    return this.bookingProcessService.processBooking(bookingData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking summary' })
  @ApiResponse({
    status: 200,
    description: 'The booking summary has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingSummary(@Param('id') id: string) {
    return this.bookingProcessService.getBookingSummary(+id);
  }

  @Get(':id/ticket')
  @ApiOperation({ summary: 'Get booking ticket as PDF' })
  @ApiResponse({
    status: 200,
    description: 'The booking ticket PDF has been successfully generated.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingTicket(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfTicketService.generateTicketPdf(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
