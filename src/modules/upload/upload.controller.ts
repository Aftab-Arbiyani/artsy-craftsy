import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
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

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
  async create(@UploadedFile() file: Multer.File) {
    try {
      if (!file) {
        const data = {
          message: CONSTANT.ERROR.REQUIRED('Image'),
          data: {},
        };
        return response.validationError(data);
      }

      // this.unlinkIfExist(`image/${file.filename}`);

      return response.successCreate({
        message: CONSTANT.SUCCESS.FILE_UPLOADED('Image'),
        data: {
          image: 'public/images/' + file.filename,
        },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
