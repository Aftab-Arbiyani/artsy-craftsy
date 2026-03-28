import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MarkOrderShippedDto {
  @IsUUID()
  @IsNotEmpty()
  order: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  items?: string[];

  @IsString()
  @IsNotEmpty()
  courier_name: string;

  @IsString()
  @IsNotEmpty()
  tracking_number: string;

  @IsString()
  @IsNotEmpty()
  courier_reciept: string;
}
