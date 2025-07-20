import { Test, TestingModule } from '@nestjs/testing';
import { CustomArtService } from './custom-art.service';

describe('CustomArtService', () => {
  let service: CustomArtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomArtService],
    }).compile();

    service = module.get<CustomArtService>(CustomArtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
