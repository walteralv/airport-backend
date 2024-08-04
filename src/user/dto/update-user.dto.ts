// src/user/dto/update-user.dto.ts
import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 50)
  username?: string;

  @IsString()
  @IsOptional()
  @Length(6, 255)
  password?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 255)
  email?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  role?: string;
}
