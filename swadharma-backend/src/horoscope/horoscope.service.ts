import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Horoscope } from './entities/horoscope.entity';
import { CreateHoroscopeDto } from './dto/create-horoscope.dto';
import { ViewHoroscopeDto } from './dto/view-horoscope.dto';

import { LocationService } from '../location/location.service';
import { ProkeralaService } from '../prokerala/prokerala.service';

@Injectable()
export class HoroscopeService {
  constructor(
    @InjectRepository(Horoscope)
    private readonly horoscopeRepository: Repository<Horoscope>,

    private readonly locationService: LocationService,

    private readonly prokeralaService: ProkeralaService,
  ) {}

  // Save Birth Details
  async create(
    createHoroscopeDto: CreateHoroscopeDto,
  ): Promise<Horoscope> {
    const horoscope =
      this.horoscopeRepository.create(
        createHoroscopeDto,
      );

    return await this.horoscopeRepository.save(
      horoscope,
    );
  }

  // Generate / View Horoscope
  async viewHoroscope(
    viewHoroscopeDto: ViewHoroscopeDto,
  ) {
    // Get the birth details entered by the user
    const {
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
    } = viewHoroscopeDto;

    console.log('Date of Birth:', dateOfBirth);
    console.log('Time of Birth:', timeOfBirth);
    console.log('Place of Birth:', placeOfBirth);

    // 1. Get latitude and longitude
    // based on the entered place of birth
    const location =
      await this.locationService.getCoordinates(
        placeOfBirth,
      );

    console.log('Location:', location);

    // 2. Create Prokerala datetime
    const datetime =
      `${dateOfBirth}T${timeOfBirth}+05:30`;

    console.log(
      'Prokerala datetime:',
      datetime,
    );

    // 3. Call Prokerala
    const horoscope =
      await this.prokeralaService.getBirthDetails(
        location.latitude,
        location.longitude,
        datetime,
      );

    console.log(
      'Prokerala Horoscope Response:',
      horoscope,
    );

    // 4. Return everything
    return {
      success: true,

      birthDetails: {
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      },

      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        displayName: location.displayName,
      },

      horoscope,
    };
  }
}