import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { DEFAULT_STATUS } from '@/shared/constants/enum';
import { Category } from '@/modules/category/entities/category.entity';

export class CreateMaterialDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Category ID is required' })
  category: Category;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEnum(DEFAULT_STATUS)
  @IsOptional()
  status?: DEFAULT_STATUS;
}
