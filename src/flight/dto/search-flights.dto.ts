// src/flight/dto/search-flights.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SearchFlightsDto {
  @ApiProperty({
    description: 'IATA code of the origin airport',
    example: 'LIM',
  })
  @IsString()
  @IsNotEmpty()
  origin_airport_code: string;

  @ApiProperty({
    description: 'IATA code of the destination airport',
    example: 'CUZ',
  })
  @IsString()
  @IsNotEmpty()
  destination_airport_code: string;

  @ApiProperty({ description: 'Departure date', example: '2024-08-07' })
  @IsString()
  @IsNotEmpty()
  departure_date: string;

  @ApiPropertyOptional({
    description: 'Return date for round trips',
    example: '2024-08-14',
  })
  @IsString()
  @IsOptional()
  return_date?: string;

  @ApiProperty({
    description: 'Type of trip',
    enum: ['oneWay', 'roundTrip'],
    example: 'roundTrip',
  })
  @IsEnum(['oneWay', 'roundTrip'])
  @IsNotEmpty()
  trip_type: 'oneWay' | 'roundTrip';

  @ApiProperty({ description: 'Number of seats', example: '2' })
  @IsString()
  @IsNotEmpty()
  seats: string;
}
