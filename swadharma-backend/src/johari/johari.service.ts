
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { JohariInvitationEntity } from './entities/johari-invitation.entity';
import { AssessmentService } from '../assessment/assessment.service';

export interface JohariAnswers {
  ratings: Record<string, number>;
  strengths: string;
  naturalAbilities: string;
  blindSpot: string;
}

@Injectable()
export class JohariService {
  constructor(
    @InjectRepository(JohariInvitationEntity)
    private readonly invitationRepository: Repository<JohariInvitationEntity>,

    private readonly assessmentService: AssessmentService,
  ) {}

  async createInvitation(
    participantId: number,
    name: string,
    email: string,
    feedbackType: string,
  ) {
    const invitation = this.invitationRepository.create({
      participantId,
      name,
      email,
      feedbackType,
      token: randomBytes(32).toString('hex'),
      submitted: false,
      answers: null,
      submittedAt: null,
    });

    return this.invitationRepository.save(invitation);
  }

  async getInvitation(token: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException(
        'Invitation not found. Please request a new feedback link.',
      );
    }

    return invitation;
  }

  async deleteInvitation(token: string): Promise<void> {
    await this.invitationRepository.delete({ token });
  }

  async submitFeedback(
    token: string,
    answers: JohariAnswers,
  ) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException(
        'Invitation not found. Please request a new feedback link.',
      );
    }

    if (invitation.submitted) {
      throw new ConflictException(
        'Feedback has already been submitted.',
      );
    }

    const submittedAt = new Date();

    const answersWithMetadata = {
      invitationId: invitation.id,
      feedbackType: invitation.feedbackType,
      feedbackProviderName: invitation.name,
      feedbackProviderEmail: invitation.email,
      ratings: answers.ratings,
      strengths: answers.strengths,
      naturalAbilities: answers.naturalAbilities,
      blindSpot: answers.blindSpot,
    };

    // Save the feedback against the participant's Johari assessment.
    await this.assessmentService.saveIndependentFeedback(
      invitation.participantId,
      'JOHARI',
      [answersWithMetadata],
      {
        source: 'EXTERNAL_FEEDBACK',
        invitationId: invitation.id,
        feedbackType: invitation.feedbackType,
        submittedAt,
        ...answers,
      },
      invitation.id,
    );

    // Mark the invitation as submitted.
    invitation.answers = answers;
    invitation.submitted = true;
    invitation.submittedAt = submittedAt;

    await this.invitationRepository.save(invitation);

    return {
      success: true,
      message: 'Johari feedback submitted successfully.',
    };
  }
}
