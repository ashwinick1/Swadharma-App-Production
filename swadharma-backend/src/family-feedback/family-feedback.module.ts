
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyFeedbackInvitationEntity } from './entities/family-feedback-invitation.entity';
import { FamilyFeedbackController } from './family-feedback.controller';
import { FamilyFeedbackService } from './family-feedback.service';
import { MailModule } from '../mail/mail.module';
import { AssessmentModule } from '../assessment/assessment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FamilyFeedbackInvitationEntity,
    ]),
    AssessmentModule,
    MailModule,
  ],
  controllers: [FamilyFeedbackController],
  providers: [FamilyFeedbackService],
  exports: [FamilyFeedbackService],
})
export class FamilyFeedbackModule {}
