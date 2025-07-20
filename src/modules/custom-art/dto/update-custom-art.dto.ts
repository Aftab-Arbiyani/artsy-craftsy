import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomArtDto } from './create-custom-art.dto';

export class UpdateCustomArtDto extends PartialType(CreateCustomArtDto) {}
