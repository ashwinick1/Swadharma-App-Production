import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UploadController } from './upload.controller';
import { UsersService } from './users.service';
import { User } from './entities/user/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    UsersController,
    UploadController,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}