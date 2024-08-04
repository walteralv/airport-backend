import { IsString, IsNotEmpty, IsDecimal, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Booking date' })
  @IsDateString()
  booking_date: string;

  @ApiProperty({ description: 'Total price' })
  @IsDecimal()
  total_price: number;

  @ApiProperty({ description: 'Booking status', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  status: string;
}
