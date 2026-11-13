import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {CreateSupportTicketDto} from './dto/create-support-ticket.dto';

import {SupportService} from './support.service';

@Controller('support')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
  ) {}

  // ================================================
  // POST /support/tickets
  // ================================================
  @Post('tickets')
  async createTicket(
    @Body() body: CreateSupportTicketDto,
  ) {
    return this.supportService.createTicket(body);
  }
}