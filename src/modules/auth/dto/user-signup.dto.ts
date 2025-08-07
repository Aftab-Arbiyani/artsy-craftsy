import { USER_TYPE } from '@/shared/constants/enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsStrongPassword()
  password: string;

  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @IsEnum(USER_TYPE)
  type: USER_TYPE;
}
