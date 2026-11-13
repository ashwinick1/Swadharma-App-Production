import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssessmentService } from '../assessment/assessment.service';
import { Horoscope } from '../horoscope/entities/horoscope.entity';

@Injectable()
export class SwadharmaReportService {
  constructor(
    private readonly assessmentService: AssessmentService,

    @InjectRepository(Horoscope)
    private readonly horoscopeRepository: Repository<Horoscope>,
  ) {}

  async getCompleteReport(userId: number) {
    // Horoscope
    const horoscope = await this.horoscopeRepository.findOne({
      where: {
        userId,
      },
    });

    // Dosha
    const dosha = await this.assessmentService.getAssessment(userId, 'DOSHA');

    // Guna
    const guna = await this.assessmentService.getAssessment(userId, 'GUNA');

    // Personality and interest mapping are stored in the PERSONALITY assessment.
    const personality = await this.assessmentService.getAssessment(
      userId,
      'PERSONALITY',
    );

    // Johari self-assessment and external feedback.
    const johari = await this.assessmentService.getAssessment(userId, 'JOHARI');

    // Feedback submitted by invited family members.
    const familyFeedback = await this.assessmentService.getAssessment(
      userId,
      'FAMILY_FEEDBACK',
    );

    return {
      success: true,

      userId,

      report: {
        horoscope,
        dosha,
        guna,
        personality,
        johari: johari
          ? {
              ...johari,
              answers: this.removeFeedbackMetadata(johari.answers),
              result: this.removeFeedbackMetadata(johari.result),
            }
          : null,
        familyFeedback: familyFeedback
          ? {
              ...familyFeedback,
              answers: this.removeFeedbackMetadata(familyFeedback.answers),
              result: this.removeFeedbackMetadata(familyFeedback.result),
            }
          : null,
      },
    };
  }

  /** Do not expose feedback invitation tokens or respondent contact details in the report API. */
  private removeFeedbackMetadata(value: unknown): unknown {
    const privateKeys = new Set([
      'id',
      'userid',
      'participantid',
      'invitationid',
      'token',
      'email',
      'feedbackprovideremail',
      'feedbackprovidername',
      'phone',
      'phonenumber',
      'submittedat',
      'createdat',
      'updatedat',
    ]);

    if (Array.isArray(value)) {
      return value.map((item) => this.removeFeedbackMetadata(item));
    }

    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .filter(
            ([key]) =>
              !privateKeys.has(key.replace(/[^a-z]/gi, '').toLowerCase()),
          )
          .map(([key, item]) => [key, this.removeFeedbackMetadata(item)]),
      );
    }

    return value;
  }
}