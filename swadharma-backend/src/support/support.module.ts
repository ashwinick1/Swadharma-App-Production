import {Module} from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';

import {MailModule} from '../mail/mail.module';

import {User} from '../users/entities/user/user';

import {SupportTicket} from './entities/support-ticket.entity';

import {SupportController} from './support.controller';

import {SupportService} from './support.service';

import {NotificationsModule} from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportTicket,
      User,
    ]),

    MailModule,

    NotificationsModule, // IMPORTANT: This was missing
  ],

  controllers: [
    SupportController,
  ],

  providers: [
    SupportService,
  ],

  exports: [
    SupportService,
  ],
})
export class SupportModule {}