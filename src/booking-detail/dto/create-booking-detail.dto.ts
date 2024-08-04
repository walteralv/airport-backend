import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDetailDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsInt()
  booking_id: number;

  @ApiProperty({ description: 'Passenger ID' })
  @IsInt()
  passenger_id: number;

  @ApiProperty({ description: 'Flight ID' })
  @IsInt()
  flight_id: number;

  @ApiProperty({ description: 'Seat ID' })
  @IsInt()
  seat_id: number;

  @ApiProperty({ description: 'Baggage ID' })
  @IsInt()
  baggage_id: number;
}
