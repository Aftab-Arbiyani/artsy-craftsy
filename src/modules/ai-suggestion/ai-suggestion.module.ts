import { Module } from '@nestjs/common';
import { AiSuggestionService } from './ai-suggestion.service';
import { AiSuggestionController } from './ai-suggestion.controller';

@Module({
  controllers: [AiSuggestionController],
  providers: [AiSuggestionService],
})
export class AiSuggestionModule {}
