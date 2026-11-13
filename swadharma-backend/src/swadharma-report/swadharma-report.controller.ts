import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { SwadharmaReportService } from './swadharma-report.service';

@Controller('swadharma-report')
export class SwadharmaReportController {
  constructor(
    private readonly swadharmaReportService: SwadharmaReportService,
  ) {}

  @Get(':userId')
  async getCompleteReport(
    @Param('userId') userId: string,
  ) {
    return await this.swadharmaReportService.getCompleteReport(
      Number(userId),
    );
  }
}