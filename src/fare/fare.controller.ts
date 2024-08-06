// src/fare/fare.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FareService } from './fare.service';
import { CreateFareDto } from './dto/create-fare.dto';
import { UpdateFareDto } from './dto/update-fare.dto';

@ApiTags('fares')
@Controller('fares')
export class FareController {
  constructor(private readonly fareService: FareService) {}

  @Post()
  @ApiOperation({ summary: 'Create fare' })
  @ApiResponse({
    status: 201,
    description: 'The fare has been successfully created.',
  })
  create(@Body() createFareDto: CreateFareDto) {
    return this.fareService.create(createFareDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fares' })
  @ApiResponse({ status: 200, description: 'Return all fares.' })
  findAll() {
    return this.fareService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fare by ID' })
  @ApiResponse({ status: 200, description: 'Return a single fare.' })
  findOne(@Param('id') id: string) {
    return this.fareService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update fare' })
  @ApiResponse({
    status: 200,
    description: 'The fare has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateFareDto: UpdateFareDto) {
    return this.fareService.update(+id, updateFareDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fare' })
  @ApiResponse({
    status: 200,
    description: 'The fare has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.fareService.remove(+id);
  }
}
