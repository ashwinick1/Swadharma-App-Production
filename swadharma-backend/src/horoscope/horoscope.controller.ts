import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { HoroscopeService } from './horoscope.service';

import { CreateHoroscopeDto } from './dto/create-horoscope.dto';

import { ViewHoroscopeDto } from './dto/view-horoscope.dto';

@Controller('horoscope')
export class HoroscopeController {
  constructor(
    private readonly horoscopeService: HoroscopeService,
  ) {}

  // =====================================================
  // Save Birth Details
  // POST /horoscope
  // =====================================================

  @Post()
  async create(
    @Body()
    createHoroscopeDto: CreateHoroscopeDto,
  ) {
    return await this.horoscopeService.create(
      createHoroscopeDto,
    );
  }

  // =====================================================
  // Generate / View Horoscope
  // POST /horoscope/view
  // =====================================================

  @Post('view')
  async viewHoroscope(
    @Body()
    body: ViewHoroscopeDto,
  ) {
    return await this.horoscopeService.viewHoroscope(
      body,
    );
  }

  // =====================================================
  // Upload Horoscope Image / PDF
  // POST /horoscope/upload
  // =====================================================

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadHoroscope(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.horoscopeService.uploadHoroscope(
      file,
    );
  }
}