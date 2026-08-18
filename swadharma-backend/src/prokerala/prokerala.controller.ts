import { Controller, Get, Query } from '@nestjs/common';
import { ProkeralaService } from './prokerala.service';

@Controller('prokerala')
export class ProkeralaController {
  constructor(
    private readonly prokeralaService: ProkeralaService,
  ) {}

  @Get('token')
  async getToken() {
    return await this.prokeralaService.getAccessToken();
  }

  @Get('birth-details')
  async getBirthDetails(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('datetime') datetime: string,
  ) {
    return await this.prokeralaService.getBirthDetails(
      latitude,
      longitude,
      datetime,
    );
  }
}