import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssessmentModule } from '../assessment/assessment.module';
import { Horoscope } from '../horoscope/entities/horoscope.entity';

import { SwadharmaReportController } from './swadharma-report.controller';
import { SwadharmaReportService } from './swadharma-report.service';

@Module({
  imports: [
    AssessmentModule,

    TypeOrmModule.forFeature([
      Horoscope,
    ]),
  ],

  controllers: [
    SwadharmaReportController,
  ],

  providers: [
    SwadharmaReportService,
  ],
})
export class SwadharmaReportModule {}