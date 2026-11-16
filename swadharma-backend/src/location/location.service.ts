
import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  async getCoordinates(place: string) {
    const cleanPlace = place.trim();

    // Avoid adding India twice.
    const query = /,\s*India$/i.test(cleanPlace)
      ? cleanPlace
      : `${cleanPlace}, India`;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'jsonv2',
            limit: 1,
          },
          headers: {
            'User-Agent': 'Swadharma-App/1.0',
          },
          timeout: 10000,
        },
      );

      if (!Array.isArray(response.data) || response.data.length === 0) {
        this.logger.warn(`Location not found: ${query}`);
        throw new NotFoundException(`Location not found: ${query}`);
      }

      const result = response.data[0];

     return {
  latitude: result.lat,
  longitude: result.lon,
  displayName: result.display_name,
};
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        'Location API failed',
        error?.response?.data || error.message,
      );

      throw new ServiceUnavailableException(
        'Location service is temporarily unavailable.',
      );
    }
  }
}
