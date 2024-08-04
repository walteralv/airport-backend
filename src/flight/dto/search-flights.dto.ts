// src/flight/dto/search-flights.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class SearchFlightsDto {
  @ApiProperty({ example: 1, description: 'Origin airport ID' })
  @IsInt()
  origin_airport_id: number;

  @ApiProperty({ example: 2, description: 'Destination airport ID' })
  @IsInt()
  destination_airport_id: number;

  @ApiProperty({ example: '2024-08-01', description: 'Departure date' })
  @IsDateString()
  departure_date: string;

  @ApiPropertyOptional({ example: '2024-08-10', description: 'Return date' })
  @IsOptional()
  @IsDateString()
  return_date?: string;

  @ApiProperty({ example: 2, description: 'Number of passengers' })
  @IsInt()
  passengers: number;
}
