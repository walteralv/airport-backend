// src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({ example: 'securepassword', description: 'Password of the user' })
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @Length(1, 255)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @Length(1, 255)
  lastName: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email of the user' })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user' })
  @IsString()
  @Length(1, 50)
  role: string;
}