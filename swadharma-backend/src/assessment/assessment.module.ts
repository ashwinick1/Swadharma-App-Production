import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssessmentResult } from './entities/assessment-result.entity';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentResult,
    ]),
  ],

  controllers: [
    AssessmentController,
  ],

  providers: [
    AssessmentService,
  ],

  exports: [
    AssessmentService,
  ],
})
export class AssessmentModule {}