
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoogleGenAI, Type } from '@google/genai';

import { AssessmentService } from '../assessment/assessment.service';
import { Horoscope } from '../horoscope/entities/horoscope.entity';
import { User } from '../users/entities/user/user';

@Injectable()
export class AiInsightsService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly assessmentService: AssessmentService,

    @InjectRepository(Horoscope)
    private readonly horoscopeRepository: Repository<Horoscope>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const apiKey =
      this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateInsights(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('A valid userId is required.');
    }

    try {
      const [
        user,
        horoscope,
        dosha,
        guna,
        personality,
        johari,
        familyFeedback,
      ] = await Promise.all([
        this.userRepository.findOne({
          where: { id: userId },
        }),

        this.horoscopeRepository.findOne({
          where: { userId },
        }),

        this.assessmentService.getAssessment(userId, 'DOSHA'),
        this.assessmentService.getAssessment(userId, 'GUNA'),
        this.assessmentService.getAssessment(userId, 'PERSONALITY'),
        this.assessmentService.getAssessment(userId, 'JOHARI'),
        this.assessmentService.getAssessment(
          userId,
          'FAMILY_FEEDBACK',
        ),
      ]);

      const assessmentData = {
        profile: user
          ? {
              location: [
                user.city,
                user.state,
                user.country,
              ]
                .filter(
                  (part) =>
                    typeof part === 'string' && part.trim(),
                )
                .join(', '),
              profileAvailable: true,
            }
          : null,

        horoscope: horoscope
          ? {
              status: horoscope.horoscopeStatus,
              horoscopeData: horoscope.horoscopeData,
            }
          : null,

        dosha: dosha
          ? {
              status: dosha.status,
              answers: dosha.answers,
              result: dosha.result,
            }
          : null,

        guna: guna
          ? {
              status: guna.status,
              answers: guna.answers,
              result: guna.result,
            }
          : null,

        personalityAndInterests: personality
          ? {
              status: personality.status,
              answers: personality.answers,
              result: personality.result,
            }
          : null,

        johariFeedback: johari
          ? {
              status: johari.status,
              answers: this.removeFeedbackMetadata(johari.answers),
              result: this.removeFeedbackMetadata(johari.result),
            }
          : null,

        familyFeedback: familyFeedback
          ? {
              status: familyFeedback.status,
              answers: this.removeFeedbackMetadata(
                familyFeedback.answers,
              ),
              result: this.removeFeedbackMetadata(
                familyFeedback.result,
              ),
            }
          : null,
      };

      const sourceCoverage = {
        profile: Boolean(user),
        horoscope: Boolean(horoscope?.horoscopeData),
        dosha: Boolean(dosha?.result || dosha?.answers),
        guna: Boolean(guna?.result || guna?.answers),
        personalityAndInterests: Boolean(
          personality?.result || personality?.answers,
        ),
        johariFeedback: Boolean(
          johari?.answers || johari?.result,
        ),
        familyFeedback: Boolean(
          familyFeedback?.answers || familyFeedback?.result,
        ),
      };

      const systemInstruction = `
You are the Swadharma Final Analysis Report engine.

Generate a balanced and practical report that helps a person
understand their strengths, interests, development areas,
possible professions, and realistic next steps.

Use only evidence supplied in the input. Never invent assessment
results, skills, qualifications, experience, or feedback.

If data is missing, identify the limitation and work only with
the available evidence.

Combine evidence from personality and interests, Johari feedback,
Family Feedback, Dosha, Guna, and horoscope where available.

Prioritize demonstrated interests, assessment answers, strengths,
and feedback when explaining career recommendations.

Horoscope, Dosha, and Guna can be discussed as reflective or
cultural perspectives, but must not be the sole basis for career
advice.

Do not make medical diagnoses, guaranteed predictions, or
deterministic claims. Do not infer career suitability from gender,
caste, religion, or other protected characteristics.

Do not give unsupported numeric career-match scores.
Recommend several possible professions rather than one compulsory
career. Explain why each profession may fit, cite evidence,
identify skills to develop, and suggest practical first steps.

If evidence is limited, clearly state that recommendations are
preliminary. Use plain and respectful language.

This report supports self-discovery. It is not a professional
psychological diagnosis or a standalone hiring decision.
`;

      const userPrompt = `
Create the Swadharma Final Analysis Report using the saved data below.

ASSESSMENT DATA:
${JSON.stringify(assessmentData, null, 2)}

SOURCE COVERAGE:
${JSON.stringify(sourceCoverage, null, 2)}

Generate a personalized, practical report. Make every career
recommendation traceable to supplied evidence and explain any
important limitations.
`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: userPrompt,

        config: {
          systemInstruction,
          responseMimeType: 'application/json',

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              summary: {
                type: Type.STRING,
              },

              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },

              personalityInsights: {
                type: Type.STRING,
              },

              interestsInsights: {
                type: Type.STRING,
              },

              workStyle: {
                type: Type.STRING,
              },

              gunaInsights: {
                type: Type.STRING,
              },

              doshaInsights: {
                type: Type.STRING,
              },

              horoscopeInsights: {
                type: Type.STRING,
              },

              johariInsights: {
                type: Type.STRING,
              },

              familyFeedbackInsights: {
                type: Type.STRING,
              },

              careerDirections: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },

              potentialRoles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },

              careerRecommendations: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    profession: {
                      type: Type.STRING,
                    },

                    whyItMayFit: {
                      type: Type.STRING,
                    },

                    supportingEvidence: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },

                    skillsToDevelop: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },

                    firstSteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },

                  required: [
                    'profession',
                    'whyItMayFit',
                    'supportingEvidence',
                    'skillsToDevelop',
                    'firstSteps',
                  ],
                },
              },

              growthAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },

              skillDevelopmentPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },

              overallGuidance: {
                type: Type.STRING,
              },

              limitations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },

            required: [
              'summary',
              'strengths',
              'personalityInsights',
              'interestsInsights',
              'workStyle',
              'gunaInsights',
              'doshaInsights',
              'horoscopeInsights',
              'johariInsights',
              'familyFeedbackInsights',
              'careerDirections',
              'potentialRoles',
              'careerRecommendations',
              'growthAreas',
              'skillDevelopmentPlan',
              'overallGuidance',
              'limitations',
            ],
          },
        },
      });

      const aiText = response.text?.trim();

      if (!aiText) {
        throw new Error('The AI provider returned an empty report.');
      }

      const insights = JSON.parse(aiText);

      // Save the generated report for later retrieval and ID-card use.
      await this.assessmentService.completeAssessment(
        userId,
        'SWADHARMA_REPORT',
        [],
        insights,
      );

      return {
        success: true,
        userId,
        generatedAt: new Date().toISOString(),
        sourceCoverage,
        insights,
      };
    } catch (error) {
      console.error(
        'Swadharma final analysis generation failed.',
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to generate the Swadharma Final Analysis Report. ' +
          'Check the backend logs and AI configuration.',
      );
    }
  }

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
      return value.map((item) =>
        this.removeFeedbackMetadata(item),
      );
    }

    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .filter(([key]) => {
            const normalizedKey = key
              .replace(/[^a-z]/gi, '')
              .toLowerCase();

            return !privateKeys.has(normalizedKey);
          })
          .map(([key, item]) => [
            key,
            this.removeFeedbackMetadata(item),
          ]),
      );
    }

    return value;
  }
}
