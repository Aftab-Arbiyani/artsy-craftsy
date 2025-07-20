import { Test, TestingModule } from '@nestjs/testing';
import { CustomArtController } from './custom-art.controller';
import { CustomArtService } from './custom-art.service';

describe('CustomArtController', () => {
  let controller: CustomArtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomArtController],
      providers: [CustomArtService],
    }).compile();

    controller = module.get<CustomArtController>(CustomArtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
