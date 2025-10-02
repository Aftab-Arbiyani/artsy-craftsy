import { CUSTOM_REQUEST_STATUS } from '@/shared/constants/enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ArtRequestReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsOptional()
  @IsEnum(CUSTOM_REQUEST_STATUS)
  status?: CUSTOM_REQUEST_STATUS;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  amount_receivable: number;
}
