
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
} from '@nestjs/common';

import { JohariService } from './johari.service';
import type { JohariAnswers } from './johari.service';
import { MailService } from '../mail/mail.service';

const QUALITIES = [
  'Confident',
  'Helpful',
  'Creative',
  'Patient',
  'Responsible',
  'Adaptable',
  'Good Listener',
  'Analytical',
  'Calm',
  'Empathetic',
  'Communicative',
  'Organised',
  'Curious',
  'Independent',
];

const FEEDBACK_TYPES: Record<string, string> = {
  family: 'Family',
  friend: 'Friend',
  mentor: 'Teacher / Mentor',
  colleague: 'Colleague',
  manager: 'Manager',
  client: 'Client',
};

function escapeHtml(value: string): string {
  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return value.replace(/[&<>"']/g, (character) => {
    return replacements[character];
  });
}

@Controller('johari')
export class JohariController {
  constructor(
    private readonly johariService: JohariService,
    private readonly mailService: MailService,
  ) {}

  // POST /johari/invitation
  @Post('invitation')
  async createInvitation(
    @Body()
    body: {
      participantId: number;
      name: string;
      email: string;
      feedbackType: string;
    },
  ) {
    if (
      !Number.isInteger(body?.participantId) ||
      body.participantId <= 0 ||
      typeof body?.name !== 'string' ||
      !body.name.trim() ||
      typeof body?.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
      typeof body?.feedbackType !== 'string' ||
      !FEEDBACK_TYPES[body.feedbackType]
    ) {
      throw new BadRequestException(
        'A valid participant ID, name, email and feedback type are required.',
      );
    }

    const participantId = body.participantId;
    const name = body.name.trim();
    const email = body.email.trim();
    const feedbackType = body.feedbackType;

    const publicUrl = process.env.JOHARI_PUBLIC_URL
      ?.trim()
      .replace(/\/+$/, '');

    if (
      !publicUrl ||
      !/^https?:\/\//i.test(publicUrl)
    ) {
      throw new BadRequestException(
        'Configure JOHARI_PUBLIC_URL with your public backend URL.',
      );
    }

    // Create and save the invitation in PostgreSQL.
    const invitation = await this.johariService.createInvitation(
      participantId,
      name,
      email,
      feedbackType,
    );

    const feedbackLink =
      `${publicUrl}/johari/feedback/${invitation.token}`;

    const typeLabel = FEEDBACK_TYPES[feedbackType];

    try {
      const result = await this.mailService.sendEmail(
        email,
        'Swadharma - Johari Window Feedback Request',
        `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#fffaf5;color:#333">
            <h2 style="color:#d97706">Swadharma - Johari Window</h2>

            <p>Hello <strong>${escapeHtml(name)}</strong>,</p>

            <p>
              You have been invited to provide
              <strong>Johari Window feedback</strong>
              as a <strong>${escapeHtml(typeLabel)}</strong>
              feedback provider.
            </p>

            <p>
              Your feedback will help the participant understand
              how others perceive their strengths, qualities and behaviour.
            </p>

            <div style="margin:24px 0;padding:18px;background:#fff;border:1px solid #ead8c8;border-radius:8px">
              <strong>Feedback Type:</strong> ${escapeHtml(typeLabel)}
              <p>Please provide honest and constructive feedback.</p>
            </div>

            <div style="text-align:center;margin:30px 0">
              <a href="${feedbackLink}"
                 style="display:inline-block;padding:14px 28px;background:#d97706;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">
                Give Your Feedback
              </a>
            </div>

            <p style="font-size:13px;color:#777">
              If the button does not work, copy this link into your browser:
            </p>

            <p style="font-size:13px;word-break:break-all">
              <a href="${feedbackLink}">${feedbackLink}</a>
            </p>

            <p>Thank you for helping with the Swadharma Johari Window assessment.</p>
            <p>Regards,<br/><strong>Swadharma Team</strong></p>
          </div>
        `,
      );

      console.log('JOHARI INVITATION EMAIL SENT', {
        invitationId: invitation.id,
        messageId: result.messageId,
      });

      return {
        success: true,
        message: 'Johari invitation email sent successfully.',
        feedbackLink,
        messageId: result.messageId,
      };
    } catch (error) {
      // Remove the invitation if the email could not be sent.
      await this.johariService.deleteInvitation(invitation.token);
      throw error;
    }
  }

  // GET /johari/feedback/:token
  @Get('feedback/:token')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getFeedbackPage(
    @Param('token') token: string,
  ): Promise<string> {
    const invitation = await this.johariService.getInvitation(token);

    if (invitation.submitted) {
      return this.messagePage(
        'Feedback already submitted',
        'Thank you. Feedback for this invitation has already been submitted.',
      );
    }

    const qualitiesHtml = QUALITIES.map((quality, index) => {
      const safeQuality = escapeHtml(quality);

      return `
        <div class="question">
          <label>${index + 1}. ${safeQuality}</label>

          <div class="ratings" data-quality="${safeQuality}">
            ${[1, 2, 3, 4, 5]
              .map(
                (number) => `
                  <label class="rating">
                    <input
                      type="radio"
                      name="rating-${index}"
                      value="${number}"
                      required
                    />
                    <span>${number}</span>
                  </label>
                `,
              )
              .join('')}
          </div>
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>Swadharma - Johari Feedback</title>

        <style>
          *{box-sizing:border-box}
          body{margin:0;padding:20px;background:#fff7ed;color:#302820;font-family:Arial,sans-serif}
          .container{max-width:720px;margin:20px auto}
          .card{background:#fff;padding:28px;border-radius:16px;box-shadow:0 4px 20px #00000012}
          h1{color:#d97706;font-size:26px}
          .intro{line-height:1.6;color:#66584e}
          .type{background:#fff0e3;padding:14px;border-radius:8px;margin:20px 0}
          .question{padding:16px 0;border-bottom:1px solid #eee2d8}
          .question>label{display:block;font-weight:bold;margin-bottom:12px}
          .ratings{display:flex;gap:10px;flex-wrap:wrap}
          .rating input{position:absolute;opacity:0;width:1px;height:1px}
          .rating span{display:flex;width:42px;height:42px;align-items:center;justify-content:center;border:1px solid #e4d6ca;border-radius:8px;cursor:pointer}
          .rating input:checked+span{background:#d97706;color:white;border-color:#d97706}
          .rating input:focus-visible+span{outline:2px solid #333}
          textarea{width:100%;min-height:100px;padding:12px;border:1px solid #d9cabe;border-radius:8px;font:inherit}
          .submit{width:100%;margin-top:24px;padding:15px;background:#d97706;color:white;border:0;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer}
          .submit:disabled{opacity:.6;cursor:wait}
          .error{color:#b42318;margin-top:12px}
          @media(max-width:480px){body{padding:10px}.card{padding:18px}h1{font-size:22px}}
        </style>
      </head>

      <body>
        <main class="container">
          <section class="card">
            <h1>Swadharma - Johari Window</h1>

            <p class="intro">
              Hello <strong>${escapeHtml(invitation.name)}</strong>.
              Please share your honest perspective about this person's
              qualities and strengths.
            </p>

            <div class="type">
              <strong>Feedback Type:</strong>
              ${escapeHtml(
                FEEDBACK_TYPES[invitation.feedbackType] ||
                  invitation.feedbackType,
              )}
            </div>

            <form id="feedbackForm">
              <h2>Rate the Qualities</h2>
              <p class="intro">
                Choose one rating for each quality:
                1 = rarely observed, 5 = consistently observed.
              </p>

              ${qualitiesHtml}

              <h2 style="margin-top:28px">Your Observations</h2>

              <div class="question">
                <label for="strengths">
                  What strengths do you notice in this person?
                </label>
                <textarea id="strengths" maxlength="3000"
                  placeholder="Share your observations"></textarea>
              </div>

              <div class="question">
                <label for="naturalAbilities">
                  What does this person seem naturally good at?
                </label>
                <textarea id="naturalAbilities" maxlength="3000"
                  placeholder="Share your observations"></textarea>
              </div>

              <div class="question">
                <label for="blindSpot">
                  Is there a quality they may not recognise in themselves?
                </label>
                <textarea id="blindSpot" maxlength="3000"
                  placeholder="Share constructive feedback"></textarea>
              </div>

              <p id="error" class="error" role="alert"></p>

              <button class="submit" id="submitButton" type="submit">
                Submit Feedback
              </button>
            </form>
          </section>
        </main>

        <script>
          const form = document.getElementById('feedbackForm');
          const errorBox = document.getElementById('error');
          const submitButton = document.getElementById('submitButton');

          form.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorBox.textContent = '';
            submitButton.disabled = true;

            const ratings = {};
            const qualities = ${JSON.stringify(QUALITIES)};

            qualities.forEach((quality, index) => {
              const selected = form.querySelector(
                'input[name="rating-' + index + '"]:checked'
              );

              if (selected) {
                ratings[quality] = Number(selected.value);
              }
            });

            if (Object.keys(ratings).length !== qualities.length) {
              errorBox.textContent = 'Please rate all qualities.';
              submitButton.disabled = false;
              return;
            }

            const answers = {
              ratings,
              strengths: document.getElementById('strengths').value.trim(),
              naturalAbilities: document.getElementById('naturalAbilities').value.trim(),
              blindSpot: document.getElementById('blindSpot').value.trim()
            };

            if (
              !answers.strengths ||
              !answers.naturalAbilities ||
              !answers.blindSpot
            ) {
              errorBox.textContent = 'Please complete all observation questions.';
              submitButton.disabled = false;
              return;
            }

            try {
              const response = await fetch(
                '/johari/feedback/${token}',
                {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(answers)
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(
                  result.message || 'Unable to submit feedback.'
                );
              }

              document.body.innerHTML = '';

              const main = document.createElement('main');
              main.className = 'container';

              const card = document.createElement('section');
              card.className = 'card';

              const heading = document.createElement('h1');
              heading.textContent = 'Thank You!';

              const message = document.createElement('p');
              message.textContent =
                'Your Johari feedback has been submitted successfully.';

              card.append(heading, message);
              main.append(card);
              document.body.append(main);
            } catch (error) {
              errorBox.textContent =
                error.message || 'Something went wrong. Please try again.';
              submitButton.disabled = false;
            }
          });
        </script>
      </body>
      </html>
    `;
  }

  // POST /johari/feedback/:token
  @Post('feedback/:token')
  async submitFeedback(
    @Param('token') token: string,
    @Body() answers: JohariAnswers,
  ) {
    if (
      !answers ||
      !answers.ratings ||
      typeof answers.ratings !== 'object' ||
      Array.isArray(answers.ratings) ||
      typeof answers.strengths !== 'string' ||
      !answers.strengths.trim() ||
      typeof answers.naturalAbilities !== 'string' ||
      !answers.naturalAbilities.trim() ||
      typeof answers.blindSpot !== 'string' ||
      !answers.blindSpot.trim()
    ) {
      throw new BadRequestException(
        'Please complete all observation questions and rate every quality.',
      );
    }

    const ratingKeys = Object.keys(answers.ratings);

    if (
      ratingKeys.length !== QUALITIES.length ||
      QUALITIES.some((quality) => {
        const rating = answers.ratings[quality];
        return !Number.isInteger(rating) || rating < 1 || rating > 5;
      }) ||
      ratingKeys.some((quality) => !QUALITIES.includes(quality))
    ) {
      throw new BadRequestException(
        'Please provide a rating from 1 to 5 for every listed quality.',
      );
    }

    return await this.johariService.submitFeedback(token, answers);
  }

  private messagePage(title: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>${escapeHtml(title)}</title>
        <style>
          body{font-family:Arial,sans-serif;background:#fff7ed;padding:24px;color:#302820}
          main{max-width:600px;margin:50px auto;background:white;padding:30px;border-radius:14px}
          h1{color:#d97706}
        </style>
      </head>
      <body>
        <main>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(message)}</p>
        </main>
      </body>
      </html>
    `;
  }
}
