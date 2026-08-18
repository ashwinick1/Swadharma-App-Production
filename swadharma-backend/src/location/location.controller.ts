import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
  ) {}

  @Get('coordinates')
  async getCoordinates(
    @Query('place') place: string,
  ) {
    return await this.locationService.getCoordinates(place);
  }
}