import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingProcessService } from './booking-process.service';

@ApiTags('booking-process')
@Controller('booking-process')
export class BookingProcessController {
  constructor(private readonly bookingProcessService: BookingProcessService) {}

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
}
