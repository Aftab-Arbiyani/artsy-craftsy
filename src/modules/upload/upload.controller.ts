import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import * as path from 'path';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@/shared/constants/constants';
import { AuthGuard } from '@nestjs/passport';
import { UploadDto } from '@/shared/dto/upload-validation';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
          const pathStr = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
          cb(null, pathStr);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(CONSTANT.ERROR.ALLOWED_FILE_TYPE),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async create(
    @UploadedFile() file: Multer.File,
    @Body() uploadDto: UploadDto,
  ) {
    try {
      if (!file) {
        const data = {
          message: CONSTANT.ERROR.REQUIRED('Image'),
          data: {},
        };
        return response.validationError(data);
      }

      const { folder } = uploadDto;

      const data = await this.uploadService.uploadFileOnS3(file, folder);

      return response.successCreate({
        message: CONSTANT.SUCCESS.FILE_UPLOADED('Image'),
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('get-file')
  async getFile(@Body('filepath') filepath: string) {
    try {
      const url = await this.uploadService.getFileFromS3(filepath);
      return response.successCreate({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('File downloaded'),
        data: { url },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
