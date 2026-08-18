import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { HoroscopeService } from './horoscope.service';
import { CreateHoroscopeDto } from './dto/create-horoscope.dto';
import { ViewHoroscopeDto } from './dto/view-horoscope.dto';

@Controller('horoscope')
export class HoroscopeController {
  constructor(
    private readonly horoscopeService: HoroscopeService,
  ) {}

  // Save birth details
  @Post()
  async create(
    @Body()
    createHoroscopeDto: CreateHoroscopeDto,
  ) {
    return await this.horoscopeService.create(
      createHoroscopeDto,
    );
  }

  // Generate / View Horoscope
  @Post('view')
  async viewHoroscope(
    @Body()
    body: ViewHoroscopeDto,
  ) {
    return await this.horoscopeService.viewHoroscope(
      body,
    );
  }
}