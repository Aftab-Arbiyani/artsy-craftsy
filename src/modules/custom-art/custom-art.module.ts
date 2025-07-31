import { Module } from '@nestjs/common';
import { CustomArtService } from './custom-art.service';
import { CustomArtController } from './custom-art.controller';
import { CustomArt } from './entities/custom-art.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomArt])],
  controllers: [CustomArtController],
  providers: [CustomArtService],
})
export class CustomArtModule {}
