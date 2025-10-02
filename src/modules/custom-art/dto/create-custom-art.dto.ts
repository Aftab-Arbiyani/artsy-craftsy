import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomArtDto {
  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  budget_range?: string;

  @IsNotEmpty()
  @IsString()
  reference_image: string;

  @IsOptional()
  @IsUUID()
  user: string;
}
