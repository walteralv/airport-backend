import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('seat')
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('select/:seatId')
  @ApiOperation({ summary: 'Select a seat' })
  @ApiResponse({
    status: 200,
    description: 'The seat has been successfully selected.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Seat not found.' })
  async selectSeat(@Param('seatId') seatId: string) {
    try {
      const updatedSeat = await this.seatService.selectSeat(+seatId);
      return updatedSeat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new seat' })
  @ApiResponse({
    status: 201,
    description: 'The seat has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all seats' })
  @ApiResponse({ status: 200, description: 'Return all seats.' })
  findAll() {
    return this.seatService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a seat by ID' })
  @ApiResponse({ status: 200, description: 'Return the seat.' })
  @ApiResponse({ status: 404, description: 'Seat not found.' })
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(+id);
  }

  @Get('flight/:flightId')
  @ApiOperation({ summary: 'Get seats for a flight' })
  @ApiResponse({
    status: 200,
    description: 'Return seats for a flight.',
  })
  async getSeatsForFlight(@Param('flightId') flightId: string) {
    return this.seatService.getSeatsForFlight(+flightId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a seat by ID' })
  @ApiResponse({
    status: 200,
    description: 'The seat has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Seat not found.' })
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a seat by ID' })
  @ApiResponse({
    status: 200,
    description: 'The seat has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Seat not found.' })
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }

  @Get('available/:flightId')
  @ApiOperation({ summary: 'Get available seats for a flight' })
  @ApiResponse({
    status: 200,
    description: 'Return available seats for a flight.',
  })
  async getAvailableSeatsForFlight(@Param('flightId') flightId: string) {
    return this.seatService.getAvailableSeatsForFlight(+flightId);
  }
}
