import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsNotEmpty()
  reference_image: string;
}
