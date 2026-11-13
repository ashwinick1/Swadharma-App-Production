
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssessmentModule } from '../assessment/assessment.module';
import { Horoscope } from '../horoscope/entities/horoscope.entity';
import { User } from '../users/entities/user/user';

import { AiInsightsController } from './ai-insights.controller';
import { AiInsightsService } from './ai-insights.service';

@Module({
  imports: [
    AssessmentModule,

    TypeOrmModule.forFeature([
      Horoscope,
      User,
    ]),
  ],

  controllers: [
    AiInsightsController,
  ],

  providers: [
    AiInsightsService,
  ],

  exports: [
    AiInsightsService,
  ],
})
export class AiInsightsModule {}
