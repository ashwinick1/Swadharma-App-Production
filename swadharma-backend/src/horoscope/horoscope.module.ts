import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HoroscopeController } from './horoscope.controller';
import { HoroscopeService } from './horoscope.service';
import { Horoscope } from './entities/horoscope.entity';

import { LocationModule } from '../location/location.module';
import { ProkeralaModule } from '../prokerala/prokerala.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Horoscope]),
    LocationModule,
    ProkeralaModule,
  ],
  controllers: [HoroscopeController],
  providers: [HoroscopeService],
})
export class HoroscopeModule {}