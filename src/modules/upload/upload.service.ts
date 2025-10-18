import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Multer } from 'multer';
import { MEDIA_FOLDER } from '@/shared/constants/enum';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  unlinkIfExist(fileName: string) {
    const filePath = __dirname + `/../../../public/${fileName}`;
    if (filePath.match(/\.\.\//g) !== null && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async uploadFileOnS3(file: Multer.File, awsFolder: MEDIA_FOLDER) {
    const { filename, path, mimetype } = file;
    const stream = fs.createReadStream(`./${path}`);

    const params = {
      Bucket: this.config.get('S3_IMAGE_BUCKET'),
      Key: `${awsFolder}/${filename}`,
      Body: stream,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
    fs.unlinkSync(`./${path}`);

    return {
      image: `${awsFolder}/${filename}`,
    };
  }

  async getFileFromS3(filepath): Promise<string> {
    const params = {
      Bucket: this.config.get('S3_IMAGE_BUCKET'),
      Key: filepath,
      ResponseContentDisposition: `attachment; filename="${filepath}"`,
    };

    try {
      const headCommand = new HeadObjectCommand(params);
      await this.s3Client.send(headCommand);
    } catch (_error) {
      throw new BadRequestException('File not found');
    }

    const getCommand = new GetObjectCommand(params);
    const url = await getSignedUrl(this.s3Client, getCommand, {
      expiresIn: 3600,
    });

    return url;
  }

  async deleteFileFromS3(filepath): Promise<void> {
    const params = {
      Bucket: this.config.get('S3_IMAGE_BUCKET'),
      Key: filepath,
    };

    try {
      const headCommand = new HeadObjectCommand(params);
      await this.s3Client.send(headCommand);
    } catch (_error) {
      throw new BadRequestException('File not found');
    }

    const deleteCommand = new DeleteObjectCommand(params);
    await this.s3Client.send(deleteCommand);
  }
}
