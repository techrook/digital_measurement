import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  brandName?: string;
}

export class resetPWDDto {
  @IsEmail()
  email?: string;
}
