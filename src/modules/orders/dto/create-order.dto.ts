import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsOptional()
  tax_amount: number;

  @IsNumber()
  @IsOptional()
  discount_amount: number;

  @IsNotEmpty()
  @IsArray()
  @Type(() => OrderItemsDto)
  @ValidateNested({ each: true })
  items: OrderItemsDto[];
}

export class OrderItemsDto {
  @IsUUID()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
