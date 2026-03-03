import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCustomOrderDto {
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
  @IsUUID()
  custom_request: string;
}
