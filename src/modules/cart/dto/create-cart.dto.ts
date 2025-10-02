import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsUUID()
  product: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsUUID()
  user?: string;
}
