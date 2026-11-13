import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { AiInsightsService } from './ai-insights.service';

@Controller('ai-insights')
export class AiInsightsController {
  constructor(
    private readonly aiInsightsService: AiInsightsService,
  ) {}

  @Get(':userId')
  async getAiInsights(
    @Param('userId') userId: string,
  ) {
    return await this.aiInsightsService.generateInsights(
      Number(userId),
    );
  }
}