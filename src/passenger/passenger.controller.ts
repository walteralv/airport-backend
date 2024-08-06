import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('passenger')
@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new passenger or return existing one' })
  @ApiResponse({
    status: 200,
    description: 'The passenger has been successfully created or found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.createOrFind(createPassengerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all passengers' })
  @ApiResponse({ status: 200, description: 'Return all passengers.' })
  findAll() {
    return this.passengerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a passenger by ID' })
  @ApiResponse({ status: 200, description: 'Return the passenger.' })
  @ApiResponse({ status: 404, description: 'Passenger not found.' })
  async findOne(@Param('id') id: string) {
    const passenger = await this.passengerService.findOne(+id);
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    return passenger;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a passenger by ID' })
  @ApiResponse({
    status: 200,
    description: 'The passenger has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Passenger not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ) {
    try {
      return await this.passengerService.update(+id, updatePassengerDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Passenger with ID ${id} not found`);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a passenger by ID' })
  @ApiResponse({
    status: 200,
    description: 'The passenger has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Passenger not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.passengerService.remove(+id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Passenger with ID ${id} not found`);
      }
      throw error;
    }
  }
}
