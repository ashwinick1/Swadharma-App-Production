import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { AssessmentService } from './assessment.service';

@Controller('assessment')
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
  ) {}

  // =====================================================
  // Start Assessment
  // =====================================================

  @Post('start')
  async startAssessment(
    @Body()
    body: {
      userId: number;
      assessmentType: string;
    },
  ) {
    return await this.assessmentService.startAssessment(
      body.userId,
      body.assessmentType,
    );
  }

  // =====================================================
  // Save Answers
  // =====================================================

  @Post('answers')
  async saveAnswers(
    @Body()
    body: {
      userId: number;
      assessmentType: string;
      answers: any[];
    },
  ) {
    return await this.assessmentService.saveAnswers(
      body.userId,
      body.assessmentType,
      body.answers,
    );
  }

  // =====================================================
  // Complete Assessment
  // =====================================================

  @Post('complete')
  async completeAssessment(
    @Body()
    body: {
      userId: number;
      assessmentType: string;
      answers: any[];
      result: any;
    },
  ) {
    return await this.assessmentService.completeAssessment(
      body.userId,
      body.assessmentType,
      body.answers,
      body.result,
    );
  }

  // =====================================================
  // Get One Assessment
  // =====================================================

  @Get()
  async getAssessment(
    @Query('userId') userId: string,
    @Query('assessmentType') assessmentType: string,
  ) {
    return await this.assessmentService.getAssessment(
      Number(userId),
      assessmentType,
    );
  }

  // =====================================================
  // Get All Assessment Statuses
  // =====================================================

  @Get('status/:userId')
  async getAssessmentStatuses(
    @Param('userId') userId: string,
  ) {
    return await this.assessmentService.getAssessmentStatuses(
      Number(userId),
    );
  }
}