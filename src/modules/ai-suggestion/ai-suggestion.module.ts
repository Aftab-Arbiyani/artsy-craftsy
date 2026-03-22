import { Module } from '@nestjs/common';
import { AiSuggestionService } from './ai-suggestion.service';
import { AiSuggestionController } from './ai-suggestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiSuggestion } from './entities/ai-suggestion.entity';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiSuggestion])],
  controllers: [AiSuggestionController],
  providers: [AiSuggestionService, UploadService],
})
export class AiSuggestionModule {}
