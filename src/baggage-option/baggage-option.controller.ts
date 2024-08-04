import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BaggageOptionService } from './baggage-option.service';
import { CreateBaggageOptionDto } from './dto/create-baggage-option.dto';
import { UpdateBaggageOptionDto } from './dto/update-baggage-option.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('baggage-option')
@Controller('baggage-option')
export class BaggageOptionController {
  constructor(private readonly baggageOptionService: BaggageOptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new baggage option' })
  @ApiResponse({ status: 201, description: 'The baggage option has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBaggageOptionDto: CreateBaggageOptionDto) {
    return this.baggageOptionService.create(createBaggageOptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all baggage options' })
  @ApiResponse({ status: 200, description: 'Return all baggage options.' })
  findAll() {
    return this.baggageOptionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a baggage option by ID' })
  @ApiResponse({ status: 200, description: 'Return the baggage option.' })
  @ApiResponse({ status: 404, description: 'Baggage option not found.' })
  findOne(@Param('id') id: string) {
    return this.baggageOptionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a baggage option by ID' })
  @ApiResponse({ status: 200, description: 'The baggage option has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Baggage option not found.' })
  update(@Param('id') id: string, @Body() updateBaggageOptionDto: UpdateBaggageOptionDto) {
    return this.baggageOptionService.update(+id, updateBaggageOptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a baggage option by ID' })
  @ApiResponse({ status: 200, description: 'The baggage option has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Baggage option not found.' })
  remove(@Param('id') id: string) {
    return this.baggageOptionService.remove(+id);
  }
}
