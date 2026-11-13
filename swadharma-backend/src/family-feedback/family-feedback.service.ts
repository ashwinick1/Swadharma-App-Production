import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { FamilyFeedbackInvitationEntity } from './entities/family-feedback-invitation.entity';
import { AssessmentService } from '../assessment/assessment.service';
import { MailService } from '../mail/mail.service';

/** The answer structure shared by the browser questionnaire and backend. */
export interface FamilyFeedbackAnswers {
  childhoodActivities: string;
  childhoodTalents: string;
  childhoodCreativity: string;
  childhoodLeadershipHelping: string;
  childhoodLearning: string;
  currentStrengths: string[];
  currentTalents: string;
  positiveQualities: string;
  continuingInterests: string;
  hiddenStrengths: string;
}

@Injectable()
export class FamilyFeedbackService {
  constructor(
    @InjectRepository(FamilyFeedbackInvitationEntity)
    private readonly invitationRepository: Repository<FamilyFeedbackInvitationEntity>,
    private readonly assessmentService: AssessmentService,
    private readonly mailService: MailService,
  ) {}

  // Create the invitation, save it, and send the email.
  async createInvitation(
    participantId: number,
    name: string,
    email: string,
    relationship: string,
    publicUrl: string,
  ) {
    const invitation = this.invitationRepository.create({
      participantId,
      name,
      email,
      relationship,
      token: randomBytes(32).toString('hex'),
      submitted: false,
      answers: null,
      submittedAt: null,
    });

    const savedInvitation = await this.invitationRepository.save(invitation);
    const feedbackUrl = `${publicUrl.replace(/\/+$/, '')}/family-feedback/feedback/${savedInvitation.token}`;

    try {
      await this.mailService.sendEmail(
        email,
        'Swadharma - Family Feedback Request',
        `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#fffaf5;color:#333">
            <h2 style="color:#d97706">Swadharma - Family Feedback</h2>
            <p>Hello <strong>${this.escapeHtml(name)}</strong>,</p>
            <p>You have been invited to provide <strong>Family Feedback</strong> for a Swadharma assessment.</p>
            <p>Your observations will help the participant understand their strengths, interests, and behavioural patterns.</p>
            <div style="margin:24px 0;padding:18px;background:#fff;border:1px solid #ead8c8;border-radius:8px">
              <strong>Relationship:</strong> ${this.escapeHtml(relationship)}
              <p>Please provide honest and constructive feedback based on your observations.</p>
            </div>
            <div style="text-align:center;margin:30px 0">
              <a href="${feedbackUrl}" style="display:inline-block;padding:14px 28px;background:#d97706;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">Give Your Feedback</a>
            </div>
            <p style="font-size:13px;color:#777">If the button does not work, copy this link into your browser:</p>
            <p style="font-size:13px;word-break:break-all"><a href="${feedbackUrl}">${feedbackUrl}</a></p>
            <p>Thank you for helping with the Swadharma Family Feedback assessment.</p>
            <p>Regards,<br/><strong>Swadharma Team</strong></p>
          </div>
        `,
      );

      return {
        success: true,
        message: 'Family feedback invitation email sent successfully.',
        feedbackLink: feedbackUrl,
      };
    } catch (error) {
      // Remove the invitation if email delivery fails.
      await this.invitationRepository.delete({ id: savedInvitation.id });
      throw error;
    }
  }

  // Retrieve an invitation using its unique token.
  async getInvitation(token: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Family feedback invitation not found.');
    }

    return invitation;
  }

  // Save feedback in the assessment data and the invitation record.
  async submitFeedback(token: string, answers: FamilyFeedbackAnswers) {
    const invitation = await this.getInvitation(token);

    if (invitation.submitted) {
      throw new ConflictException('Family feedback has already been submitted.');
    }

    this.validateAnswers(answers);
    const submittedAt = new Date();

    const answersWithMetadata = {
      invitationId: invitation.id,
      feedbackType: 'FAMILY_FEEDBACK',
      feedbackProviderName: invitation.name,
      feedbackProviderEmail: invitation.email,
      relationship: invitation.relationship,
      ...answers,
    };

    await this.assessmentService.saveIndependentFeedback(
      invitation.participantId,
      'FAMILY_FEEDBACK',
      [answersWithMetadata],
      {
        source: 'EXTERNAL_FEEDBACK',
        invitationId: invitation.id,
        relationship: invitation.relationship,
        submittedAt,
        ...answers,
      },
      invitation.id,
    );

    invitation.answers = answersWithMetadata;
    invitation.submitted = true;
    invitation.submittedAt = submittedAt;
    await this.invitationRepository.save(invitation);

    return {
      success: true,
      message: 'Family feedback submitted successfully.',
    };
  }

  private validateAnswers(answers: FamilyFeedbackAnswers): void {
    if (!answers || typeof answers !== 'object') {
      throw new BadRequestException('Please provide your family feedback answers.');
    }

    const textFields: Array<keyof Omit<FamilyFeedbackAnswers, 'currentStrengths'>> = [
      'childhoodActivities',
      'childhoodTalents',
      'childhoodCreativity',
      'childhoodLeadershipHelping',
      'childhoodLearning',
      'currentTalents',
      'positiveQualities',
      'continuingInterests',
      'hiddenStrengths',
    ];

    for (const field of textFields) {
      if (typeof answers[field] !== 'string' || !answers[field].trim()) {
        throw new BadRequestException(`Please answer: ${field}.`);
      }
    }

    if (
      !Array.isArray(answers.currentStrengths) ||
      answers.currentStrengths.length === 0 ||
      answers.currentStrengths.some((strength) => typeof strength !== 'string' || !strength.trim())
    ) {
      throw new BadRequestException('Please select at least one current strength.');
    }
  }

  private escapeHtml(value: string): string {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return value.replace(/[&<>"']/g, (character) => entities[character]);
  }
}