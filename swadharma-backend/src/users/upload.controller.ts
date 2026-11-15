
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { tmpdir } from 'os';

const uploadDir = join(
  tmpdir(),
  'swadharma',
  'uploads',
  'profile',
);

@Controller('upload')
export class UploadController {
  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          try {
            mkdirSync(uploadDir, { recursive: true });
            callback(null, uploadDir);
          } catch (error) {
            callback(error as Error, uploadDir);
          }
        },
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
    }),
  )
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      success: true,
      filename: file.filename,
      imageUrl: `http://10.0.2.2:3000/uploads/profile/${file.filename}`,
    };
  }
}
