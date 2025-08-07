import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  unlinkIfExist(fileName: string) {
    const filePath = __dirname + `/../../../public/${fileName}`;
    if (filePath.match(/\.\.\//g) !== null && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
