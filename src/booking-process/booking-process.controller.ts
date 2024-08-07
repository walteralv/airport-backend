import { Controller, Post, Body } from '@nestjs/common';
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
}
