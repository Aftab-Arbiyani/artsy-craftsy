import { ORIENTATION } from '@/shared/constants/enum';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FilterProductsDto extends QueryParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  category_id?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(ORIENTATION, { each: true })
  @Type(() => String)
  orientation?: ORIENTATION[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  artist_id?: string[];

  @IsOptional()
  @IsNumberString()
  price_from?: string;

  @IsOptional()
  @IsNumberString()
  price_to?: string;
}
