import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAirportDto {
  @ApiProperty({ description: 'Airport name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({ description: 'City where the airport is located', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  city: string;

  @ApiProperty({ description: 'Country where the airport is located', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  country: string;

  @ApiProperty({ description: 'IATA code of the airport', maxLength: 3 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  IATA_code: string;

  @ApiProperty({ description: 'ICAO code of the airport', maxLength: 4 })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  ICAO_code: string;

  @ApiProperty({ description: 'Current status of the airport', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  status: string;
}
