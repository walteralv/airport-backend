// src/flight/dto/create-flight.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, Length, Min } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty({ example: 'AA123', description: 'Flight number' })
  @IsString()
  @Length(1, 10)
  flight_number: string;

  @ApiProperty({ example: 'American Airlines', description: 'Airline name' })
  @IsString()
  @Length(1, 255)
  airline: string;

  @ApiProperty({ example: 1, description: 'Origin airport ID' })
  @IsInt()
  origin_airport_id: number;

  @ApiProperty({ example: 2, description: 'Destination airport ID' })
  @IsInt()
  destination_airport_id: number;

  @ApiProperty({ example: '2024-08-01T12:00:00Z', description: 'Departure time' })
  @IsDate()
  departure_time: Date;

  @ApiProperty({ example: '2024-08-01T15:00:00Z', description: 'Arrival time' })
  @IsDate()
  arrival_time: Date;

  @ApiProperty({ example: 1, description: 'Number of stopovers' })
  @IsInt()
  @Min(0)
  stopOvers: number;

  @ApiProperty({ example: 180, description: 'Duration of the flight in minutes' })
  @IsInt()
  @Min(0)
  duration: number;

  @ApiProperty({ example: 'Scheduled', description: 'Flight status' })
  @IsString()
  @Length(1, 50)
  status: string;

  @ApiProperty({ example: 'Boeing 737', description: 'Type of equipment' })
  @IsString()
  @Length(1, 50)
  equipment: string;

  @ApiProperty({ example: 'Leased from XYZ', description: 'Aircraft lease text' })
  @IsString()
  @Length(1, 255)
  aircraft_lease_text: string;
}
