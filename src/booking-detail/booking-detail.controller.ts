import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingDetailService } from './booking-detail.service';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { UpdateBookingDetailDto } from './dto/update-booking-detail.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('booking-detail')
@Controller('booking-detail')
export class BookingDetailController {
  constructor(private readonly bookingDetailService: BookingDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking detail' })
  @ApiResponse({ status: 201, description: 'The booking detail has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBookingDetailDto: CreateBookingDetailDto) {
    return this.bookingDetailService.create(createBookingDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all booking details' })
  @ApiResponse({ status: 200, description: 'Return all booking details.' })
  findAll() {
    return this.bookingDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking detail by ID' })
  @ApiResponse({ status: 200, description: 'Return the booking detail.' })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingDetailService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking detail by ID' })
  @ApiResponse({ status: 200, description: 'The booking detail has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  update(@Param('id') id: string, @Body() updateBookingDetailDto: UpdateBookingDetailDto) {
    return this.bookingDetailService.update(+id, updateBookingDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking detail by ID' })
  @ApiResponse({ status: 200, description: 'The booking detail has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Booking detail not found.' })
  remove(@Param('id') id: string) {
    return this.bookingDetailService.remove(+id);
  }
}
