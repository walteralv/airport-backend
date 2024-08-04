// src/stopover/stopover.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StopOverService } from './stop-over.service';
import { CreateStopOverDto } from './dto/create-stop-over.dto';
import { UpdateStopOverDto } from './dto/update-stop-over.dto';

@ApiTags('stopovers')
@Controller('stopovers')
export class StopOverController {
  constructor(private readonly stopOverService: StopOverService) {}

  @Post()
  @ApiOperation({ summary: 'Create stopover' })
  @ApiResponse({ status: 201, description: 'The stopover has been successfully created.' })
  create(@Body() createStopOverDto: CreateStopOverDto) {
    return this.stopOverService.create(createStopOverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stopovers' })
  @ApiResponse({ status: 200, description: 'Return all stopovers.' })
  findAll() {
    return this.stopOverService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stopover by ID' })
  @ApiResponse({ status: 200, description: 'Return a single stopover.' })
  findOne(@Param('id') id: string) {
    return this.stopOverService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update stopover' })
  @ApiResponse({ status: 200, description: 'The stopover has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateStopOverDto: UpdateStopOverDto) {
    return this.stopOverService.update(+id, updateStopOverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stopover' })
  @ApiResponse({ status: 200, description: 'The stopover has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.stopOverService.remove(+id);
  }
}
