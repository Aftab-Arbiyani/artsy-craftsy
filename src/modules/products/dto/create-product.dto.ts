import { Category } from '@/modules/category/entities/category.entity';
import { Material } from '@/modules/material/entities/material.entity';
import { ORIENTATION } from '@/shared/constants/enum';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ORIENTATION)
  @IsNotEmpty()
  orientation: ORIENTATION;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsOptional()
  depth?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  listing_price: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  amount_receivable: number;

  @IsBoolean()
  @IsNotEmpty()
  is_copyright_owner: boolean;

  @IsUUID()
  @IsNotEmpty()
  category: Category;

  @IsUUID()
  @IsOptional()
  materials: Material;

  @IsUUID()
  @IsOptional()
  user: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  images: string[];
}
