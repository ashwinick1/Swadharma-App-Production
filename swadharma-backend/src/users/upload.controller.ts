import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile',
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
      imageUrl: `http://10.0.2.2:3000/uploads/profile/${file.filename}`,
    };
  }
}