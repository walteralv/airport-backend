// src/stopover/dto/create-stopover.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, Length, Min } from 'class-validator';

export class CreateStopOverDto {
  @ApiProperty({ example: 1, description: 'Flight ID' })
  @IsInt()
  flight_id: number;

  @ApiProperty({ example: 1, description: 'Stop number' })
  @IsInt()
  stop_number: number;

  @ApiProperty({ example: 1, description: 'Airport ID' })
  @IsInt()
  airport_id: number;

  @ApiProperty({ example: '2024-08-01T12:00:00Z', description: 'Arrival time' })
  @IsDate()
  arrival_time: Date;

  @ApiProperty({ example: '2024-08-01T15:00:00Z', description: 'Departure time' })
  @IsDate()
  departure_time: Date;

  @ApiProperty({ example: '15', description: 'Layover duration in minutes' })
  @IsInt()
  layover_duration: number;

  @ApiProperty({ example: 'Scheduled', description: 'Status of the stopover' })
  @IsString()
  @Length(1, 50)
  status: string;
}
