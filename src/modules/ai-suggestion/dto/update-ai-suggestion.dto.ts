import { PartialType } from '@nestjs/mapped-types';
import { CreateAiSuggestionDto } from './create-ai-suggestion.dto';

export class UpdateAiSuggestionDto extends PartialType(CreateAiSuggestionDto) {}
