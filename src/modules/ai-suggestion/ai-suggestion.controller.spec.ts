import { Test, TestingModule } from '@nestjs/testing';
import { AiSuggestionController } from './ai-suggestion.controller';
import { AiSuggestionService } from './ai-suggestion.service';

describe('AiSuggestionController', () => {
  let controller: AiSuggestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiSuggestionController],
      providers: [AiSuggestionService],
    }).compile();

    controller = module.get<AiSuggestionController>(AiSuggestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
