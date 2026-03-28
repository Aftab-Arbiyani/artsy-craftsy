import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiSuggestion } from './entities/ai-suggestion.entity';
import { CreateAiSuggestionDto } from './dto/create-ai-suggestion.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AiSuggestionService {
  constructor(
    @InjectRepository(AiSuggestion)
    private readonly aiSuggestionRepository: Repository<AiSuggestion>,
  ) {}

  async countThisMonth(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return this.aiSuggestionRepository
      .createQueryBuilder('ai')
      .where('ai.user_id = :userId', { userId })
      .andWhere('ai.created_at >= :start', { start: startOfMonth })
      .andWhere('ai.created_at < :end', { end: startOfNextMonth })
      .getCount();
  }

  async create(
    createAiSuggestionDto: CreateAiSuggestionDto,
  ): Promise<AiSuggestion> {
    const data = await this.aiSuggestionRepository.save(
      plainToInstance(AiSuggestion, createAiSuggestionDto),
    );

    return plainToInstance(AiSuggestion, data);
  }
}
