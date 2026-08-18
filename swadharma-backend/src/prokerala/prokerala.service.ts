import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProkeralaService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  // Get OAuth Access Token
  async getAccessToken() {
    const clientId = this.configService.get<string>(
      'PROKERALA_CLIENT_ID',
    );

    const clientSecret = this.configService.get<string>(
      'PROKERALA_CLIENT_SECRET',
    );

    const response = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId!,
        client_secret: clientSecret!,
      }),
      {
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  }

  // Get Birth Details from Prokerala
  async getBirthDetails(
    latitude: string,
    longitude: string,
    dateTime: string,
  ) {
    const token = await this.getAccessToken();

    const response = await axios.get(
      'https://api.prokerala.com/v2/astrology/birth-details',
      {
        params: {
          ayanamsa: 1,
          coordinates: `${latitude},${longitude}`,
          datetime: dateTime,
          la: 'en',
        },
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      },
    );

    return response.data;
  }
}