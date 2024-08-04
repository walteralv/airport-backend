import { IsString, IsNotEmpty, IsDecimal, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBaggageOptionDto {
  @ApiProperty({ description: 'Baggage type', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  type: string;

  @ApiProperty({ description: 'Baggage price' })
  @IsDecimal()
  price: number;
}
