import { CONSTANT } from '@/shared/constants/message';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EmailLoginDto {
  @IsNotEmpty()
  @IsLowercase()
  @IsEmail({}, { message: CONSTANT.ERROR.INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  device_id: string;

  @IsOptional()
  @IsString()
  device_name?: string;

  @IsNotEmpty()
  @IsString()
  device_type: string;
}
