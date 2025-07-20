import { Module } from '@nestjs/common';
import { CustomArtService } from './custom-art.service';
import { CustomArtController } from './custom-art.controller';

@Module({
  controllers: [CustomArtController],
  providers: [CustomArtService],
})
export class CustomArtModule {}
