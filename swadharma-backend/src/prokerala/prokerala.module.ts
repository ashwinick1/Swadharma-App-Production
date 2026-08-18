import { Module } from '@nestjs/common';
import { ProkeralaController } from './prokerala.controller';
import { ProkeralaService } from './prokerala.service';

@Module({
  controllers: [ProkeralaController],
  providers: [ProkeralaService],
  exports: [ProkeralaService],
})
export class ProkeralaModule {}