// src/flight-fare/dto/create-flight-fare.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal, IsBoolean, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateFlightFareDto {
  @ApiProperty({ example: 1, description: 'Flight ID' })
  @IsInt()
  flight_id: number;

  @ApiProperty({ example: 1, description: 'Fare ID' })
  @IsInt()
  fare_id: number;

  @ApiProperty({ example: 199.99, description: 'Price of the fare' })
  @IsDecimal()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the price' })
  @IsString()
  @Length(1, 10)
  currency: string;

  @ApiProperty({ example: 'USD', description: 'Display currency' })
  @IsString()
  @Length(1, 10)
  display_currency: string;

  @ApiProperty({ example: '199.99', description: 'Display amount' })
  @IsString()
  @Length(1, 50)
  display_amount: string;

  @ApiProperty({ example: 50.00, description: 'Lowest price difference' })
  @IsDecimal()
  @Min(0)
  lowest_price_difference: number;

  @ApiProperty({ example: 'Basic', description: 'Lowest price brand' })
  @IsString()
  @Length(1, 50)
  lowest_price_brand: string;

  @ApiProperty({ example: true, description: 'Availability of the fare' })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ example: '{}', description: 'Attributes of the fare', type: 'object' })
  @IsNotEmpty()
  attributes: Record<string, any>;
}