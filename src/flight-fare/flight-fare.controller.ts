// src/flight-fare/flight-fare.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FlightFareService } from './flight-fare.service';
import { CreateFlightFareDto } from './dto/create-flight-fare.dto';
import { UpdateFlightFareDto } from './dto/update-flight-fare.dto';

@ApiTags('flight-fares')
@Controller('flight-fares')
export class FlightFareController {
  constructor(private readonly flightFareService: FlightFareService) {}

  @Post()
  @ApiOperation({ summary: 'Create flight fare' })
  @ApiResponse({ status: 201, description: 'The flight fare has been successfully created.' })
  create(@Body() createFlightFareDto: CreateFlightFareDto) {
    return this.flightFareService.create(createFlightFareDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flight fares' })
  @ApiResponse({ status: 200, description: 'Return all flight fares.' })
  findAll() {
    return this.flightFareService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flight fare by ID' })
  @ApiResponse({ status: 200, description: 'Return a single flight fare.' })
  findOne(@Param('id') id: string) {
    return this.flightFareService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update flight fare' })
  @ApiResponse({ status: 200, description: 'The flight fare has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateFlightFareDto: UpdateFlightFareDto) {
    return this.flightFareService.update(+id, updateFlightFareDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete flight fare' })
  @ApiResponse({ status: 200, description: 'The flight fare has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.flightFareService.remove(+id);
  }
}
