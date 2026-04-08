import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AiSuggestionService } from './ai-suggestion.service';
import { CreateAiSuggestionDto } from './dto/create-ai-suggestion.dto';
import response from '@/shared/helpers/response';
import { generateImageWithImagen } from '@/shared/helpers/ai-service';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@/shared/constants/types';
import { MEDIA_FOLDER } from '@/shared/constants/enum';
import { UploadService } from '../upload/upload.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('ai-suggestion')
export class AiSuggestionController {
  constructor(
    private readonly aiSuggestionService: AiSuggestionService,
    private readonly uploadService: UploadService,
  ) {}

  @Throttle({
    default: { limit: 3, ttl: 60000 },
  })
  @UseGuards(AuthGuard('jwt'), ThrottlerGuard)
  @Post()
  async create(
    @Body() createAiSuggestionDto: CreateAiSuggestionDto,
    @Req() req: IRequest,
  ) {
    try {
      createAiSuggestionDto.user = req.user.id;

      const usageThisMonth = await this.aiSuggestionService.countThisMonth(
        req.user.id,
      );
      if (usageThisMonth >= 2) {
        return response.badRequest({
          message:
            'You have reached the limit for AI studio usage for this month.',
          data: {},
        });
      }

      const image = await generateImageWithImagen({
        prompt: createAiSuggestionDto.prompt,
      });

      if (!image) {
        return response.badRequest({
          message:
            'Failed to generate image. Please try again after some time.',
          data: {},
        });
      }

      const data = await this.uploadService.uploadGeneratedFileOnS3(
        image,
        MEDIA_FOLDER.products,
      );

      createAiSuggestionDto.response_image = data.image;
      const result = await this.aiSuggestionService.create(
        createAiSuggestionDto,
      );
      return response.successResponse({
        message: 'AI suggestion created successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return response.badRequest({ message: error.message, data: {} });
      }
      return response.failureResponse(error);
    }
  }
}
