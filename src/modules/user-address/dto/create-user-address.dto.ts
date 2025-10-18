import { ADDRESSTYPE } from '@/shared/constants/enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserAddressDto {
  @IsUUID()
  @IsOptional()
  user: string;

  @IsNotEmpty()
  @IsEnum(ADDRESSTYPE)
  type: ADDRESSTYPE;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}
