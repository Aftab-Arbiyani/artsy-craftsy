import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAiSuggestionDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  reference_image?: string;

  @IsOptional()
  @IsString()
  response_image?: string;

  @IsOptional()
  @IsString()
  user?: string;
}
