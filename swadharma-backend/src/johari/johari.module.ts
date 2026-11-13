  
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JohariController } from './johari.controller';
import { JohariService } from './johari.service';
import { JohariInvitationEntity } from './entities/johari-invitation.entity';
import { MailModule } from '../mail/mail.module';
import { AssessmentModule } from '../assessment/assessment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JohariInvitationEntity]),
    AssessmentModule,
    MailModule,
  ],
  controllers: [JohariController],
  providers: [JohariService],
  exports: [JohariService],
})
export class JohariModule {}
