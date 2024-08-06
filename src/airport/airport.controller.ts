import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('airport')
@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new airport' })
  @ApiResponse({
    status: 201,
    description: 'The airport has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all airports' })
  @ApiResponse({ status: 200, description: 'Return all airports.' })
  findAll() {
    return this.airportService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search airports by term' })
  @ApiResponse({ status: 200, description: 'Return matching airports.' })
  @ApiQuery({ name: 'term', required: true, type: String })
  searchAirports(@Query('term') searchTerm: string) {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }
    return this.airportService.searchAirports(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an airport by ID' })
  @ApiResponse({ status: 200, description: 'Return the airport.' })
  @ApiResponse({ status: 404, description: 'Airport not found.' })
  findOne(@Param('id') id: string) {
    return this.airportService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an airport by ID' })
  @ApiResponse({
    status: 200,
    description: 'The airport has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Airport not found.' })
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an airport by ID' })
  @ApiResponse({
    status: 200,
    description: 'The airport has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Airport not found.' })
  remove(@Param('id') id: string) {
    return this.airportService.remove(+id);
  }
}
