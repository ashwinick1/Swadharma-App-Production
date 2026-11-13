
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssessmentResult } from './entities/assessment-result.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(AssessmentResult)
    private readonly assessmentRepository: Repository<AssessmentResult>,
  ) {}

  // =====================================================
  // Start Assessment
  // =====================================================

  async startAssessment(
    userId: number,
    assessmentType: string,
  ) {
    let assessment =
      await this.assessmentRepository.findOne({
        where: {
          userId,
          assessmentType,
        },
      });

    if (!assessment) {
      assessment =
        this.assessmentRepository.create({
          userId,
          assessmentType,
          status: 'IN_PROGRESS',
          answers: [],
          result: null,
          startedAt: new Date(),
        });
    } else {
      assessment.status = 'IN_PROGRESS';

      if (!assessment.startedAt) {
        assessment.startedAt = new Date();
      }
    }

    return await this.assessmentRepository.save(assessment);
  }

  // =====================================================
  // Save Answers
  // =====================================================

  async saveAnswers(
    userId: number,
    assessmentType: string,
    answers: any[],
  ) {
    const assessment =
      await this.assessmentRepository.findOne({
        where: {
          userId,
          assessmentType,
        },
      });

    if (!assessment) {
      throw new NotFoundException(
        'Assessment has not been started.',
      );
    }

    assessment.answers = answers;

    return await this.assessmentRepository.save(assessment);
  }

  // =====================================================
  // Complete Assessment
  // =====================================================

  async completeAssessment(
    userId: number,
    assessmentType: string,
    answers: any[],
    result: any,
  ) {
    let assessment =
      await this.assessmentRepository.findOne({
        where: {
          userId,
          assessmentType,
        },
      });

    if (!assessment) {
      assessment =
        this.assessmentRepository.create({
          userId,
          assessmentType,
          status: 'IN_PROGRESS',
          answers: [],
          result: null,
          startedAt: new Date(),
        });
    }

    assessment.answers = answers;
    assessment.result = result;
    assessment.status = 'COMPLETED';
    assessment.completedAt = new Date();

    return await this.assessmentRepository.save(assessment);
  }

  // =====================================================
  // Save Independent Feedback Record
  // =====================================================

  async saveIndependentFeedback(
    userId: number,
    assessmentType: string,
    answers: any[],
    result: any,
    invitationId: number,
  ) {
    // Check whether a record already exists for this invitation.
    const existing =
      await this.assessmentRepository
        .createQueryBuilder('assessment')
        .where('assessment.userId = :userId', {
          userId,
        })
        .andWhere(
          'assessment.assessmentType = :assessmentType',
          { assessmentType },
        )
        .andWhere(
          "assessment.answers -> 0 ->> 'invitationId' = :invitationId",
          { invitationId: String(invitationId) },
        )
        .getOne();

    if (existing) {
      throw new ConflictException(
        'Feedback for this invitation has already been saved.',
      );
    }

    const now = new Date();

    const assessment =
      this.assessmentRepository.create({
        userId,
        assessmentType,
        status: 'COMPLETED',
        answers,
        result,
        startedAt: now,
        completedAt: now,
      });

    return await this.assessmentRepository.save(assessment);
  }

  // =====================================================
  // Get Single Assessment
  // =====================================================

  async getAssessment(
    userId: number,
    assessmentType: string,
  ) {
    return await this.assessmentRepository.findOne({
      where: {
        userId,
        assessmentType,
      },
    });
  }

  // =====================================================
  // Get Multiple Assessment Records
  // =====================================================

  async getAllAssessments(
    userId: number,
    assessmentType: string,
  ) {
    return await this.assessmentRepository.find({
      where: {
        userId,
        assessmentType,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =====================================================
  // Get All Assessment Statuses
  // =====================================================

  async getAssessmentStatuses(userId: number) {
    const assessments =
      await this.assessmentRepository.find({
        where: {
          userId,
        },
      });

    const assessmentTypes = [
      'HOROSCOPE',
      'DOSHA',
      'GUNA',
      'PERSONALITY',
      'JOHARI',
      'FAMILY_FEEDBACK',
    ];

    const statuses: Record<string, string> = {};

    for (const type of assessmentTypes) {
      const matchingAssessments = assessments.filter(
        item => item.assessmentType === type,
      );

      if (type === 'JOHARI' || type === 'FAMILY_FEEDBACK') {
        statuses[type] = matchingAssessments.some(
          item => item.status === 'COMPLETED',
        )
          ? 'COMPLETED'
          : matchingAssessments.some(
                item => item.status === 'IN_PROGRESS',
              )
            ? 'IN_PROGRESS'
            : 'NOT_STARTED';
      } else {
        statuses[type] =
          matchingAssessments[0]?.status || 'NOT_STARTED';
      }
    }

    return statuses;
  }
}
