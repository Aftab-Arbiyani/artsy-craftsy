import { Controller } from '@nestjs/common';
import { CustomArtService } from './custom-art.service';

@Controller('custom-art')
export class CustomArtController {
  constructor(private readonly customArtService: CustomArtService) {}
}
