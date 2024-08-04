import { IsString, IsNotEmpty, IsInt, IsBoolean, IsDecimal, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatDto {
  @ApiProperty({ description: 'Flight ID' })
  @IsInt()
  flight_id: number;

  @ApiProperty({ description: 'Seat number', maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  seat_number: string;

  @ApiProperty({ description: 'Seat class', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  class: string;

  @ApiProperty({ description: 'Seat type', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  seat_type: string;

  @ApiProperty({ description: 'Seat availability' })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ description: 'Seat price' })
  @IsDecimal()
  price: number;
}
