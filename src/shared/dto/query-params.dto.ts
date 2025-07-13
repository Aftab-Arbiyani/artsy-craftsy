import { IsObject, IsOptional, IsString } from 'class-validator';
import { OrderBy } from '../constants/types';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/constants';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  take: string = DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  skip: string = DEFAULT_OFFSET;

  @IsObject()
  @IsOptional()
  order: OrderBy = { created_at: 'DESC' };

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;
}
