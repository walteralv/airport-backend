// src/fare/dto/create-fare.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateFareDto {
  @ApiProperty({ example: 'Economy', description: 'Type of fare' })
  @IsString()
  @Length(1, 50)
  fare_type: string;

  @ApiProperty({ example: 'Basic economy fare', description: 'Description of fare' })
  @IsString()
  @Length(1, 255)
  description: string;

  @ApiProperty({ example: 'EC', description: 'Cabin ID' })
  @IsString()
  @Length(1, 10)
  cabin_id: string;

  @ApiProperty({ example: 'Economy Class', description: 'Cabin label' })
  @IsString()
  @Length(1, 50)
  cabin_label: string;
}
