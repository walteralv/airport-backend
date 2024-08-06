import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassengerDto {
  @ApiProperty({ description: 'First name of the passenger', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @ApiProperty({ description: 'Last name of the passenger', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @ApiProperty({
    description: 'Passport number of the passenger',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Passport number must contain only uppercase letters and numbers',
  })
  passport_number: string;

  @ApiProperty({ description: 'Nationality of the passenger', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nationality: string;

  @ApiProperty({ description: 'Phone number of the passenger', maxLength: 25 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^\+?[0-9\s-]+$/, { message: 'Invalid phone number format' })
  phone: string;

  @ApiProperty({ description: 'Email address of the passenger', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;
}
