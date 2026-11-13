
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { ProkeralaModule } from './prokerala/prokerala.module';
import { LocationModule } from './location/location.module';
import { AssessmentModule } from './assessment/assessment.module';
import { AiInsightsModule } from './ai-insights/ai-insights.module';
import { SwadharmaReportModule } from './swadharma-report/swadharma-report.module';
import { MailModule } from './mail/mail.module';
import { JohariModule } from './johari/johari.module';
import { FamilyFeedbackModule } from './family-feedback/family-feedback.module';
import {SupportModule} from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Swadharma@123',
      database: process.env.DB_NAME || 'swadharma',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    HoroscopeModule,
    ProkeralaModule,
    LocationModule,
    AssessmentModule,
    AiInsightsModule,
    SwadharmaReportModule,
    MailModule,
    JohariModule,
    FamilyFeedbackModule,
    MailModule,
SupportModule,
  NotificationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
