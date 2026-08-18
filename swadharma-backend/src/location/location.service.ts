import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
  async getCoordinates(place: string) {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: `${place}, India`,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'Swadharma-App',
        },
      },
    );

    if (response.data.length === 0) {
      throw new Error('Location not found');
    }

    return {
      latitude: response.data[0].lat,
      longitude: response.data[0].lon,
      displayName: response.data[0].display_name,
    };
  }
}