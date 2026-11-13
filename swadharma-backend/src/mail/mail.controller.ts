import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
  ) {}

  // -----------------------------------------
  // TEST EMAIL
  // POST /mail/test
  // -----------------------------------------
  @Post('test')
  async sendTestEmail(
    @Body() body: { to: string },
  ) {
    if (!body?.to) {
      throw new BadRequestException(
        'Email address is required',
      );
    }

    const result = await this.mailService.sendEmail(
      body.to,
      'Swadharma Email Test',
      `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            color: #333333;
            background-color: #fffaf5;
          "
        >
          <h2 style="color: #d97706;">
            Swadharma Email Test
          </h2>

          <p>
            This is a test email from the
            Swadharma backend.
          </p>

          <p>
            Your SMTP configuration is working
            successfully.
          </p>

          <p>
            Regards,<br />
            <strong>Swadharma Team</strong>
          </p>
        </div>
      `,
    );

    console.log('SMTP RESULT:', result);

    return {
      success: true,
      message: 'Test email processed.',
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    };
  }

  // -----------------------------------------
  // JOHARI WINDOW INVITATION
  // POST /mail/johari-invitation
  // -----------------------------------------
  @Post('johari-invitation')
  async sendJohariInvitation(
    @Body()
    body: {
      name: string;
      email: string;
      feedbackType: string;
      feedbackLink: string;
    },
  ) {
    if (
      !body?.name ||
      !body?.email ||
      !body?.feedbackType ||
      !body?.feedbackLink
    ) {
      throw new BadRequestException(
        'name, email, feedbackType and feedbackLink are required',
      );
    }

    const feedbackTypeLabels: Record<string, string> = {
      family: 'Family',
      friend: 'Friend',
      mentor: 'Teacher / Mentor',
      colleague: 'Colleague',
      manager: 'Manager',
      client: 'Client',
    };

    const feedbackTypeLabel =
      feedbackTypeLabels[body.feedbackType] ||
      'Feedback Provider';

    const result =
      await this.mailService.sendEmail(
        body.email,
        'Swadharma - Johari Window Feedback Request',
        `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              color: #333333;
              background-color: #fffaf5;
            "
          >

            <h2
              style="
                color: #d97706;
                margin-bottom: 20px;
              "
            >
              Swadharma - Johari Window
            </h2>

            <p>
              Hello <strong>${body.name}</strong>,
            </p>

            <p>
              You have been invited to provide
              <strong>Johari Window feedback</strong>
              as a
              <strong>${feedbackTypeLabel}</strong>
              feedback provider.
            </p>

            <p>
              Your feedback will help the participant
              understand how others perceive their
              strengths, qualities and behaviour.
            </p>

            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ead8c8;
                border-radius: 8px;
              "
            >
              <p style="margin: 0 0 10px 0;">
                <strong>Feedback Type:</strong>
                ${feedbackTypeLabel}
              </p>

              <p style="margin: 0;">
                Please provide honest and constructive
                feedback based on your experience with
                the participant.
              </p>
            </div>

            <!-- FEEDBACK BUTTON -->
            <div
              style="
                text-align: center;
                margin: 30px 0;
              "
            >
              <a
                href="${body.feedbackLink}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: #d97706;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                "
              >
                Provide Feedback
              </a>
            </div>

            <p
              style="
                font-size: 13px;
                color: #777777;
              "
            >
              If the button above does not work,
              please copy and paste the following
              link into your browser:
            </p>

            <p
              style="
                font-size: 13px;
                word-break: break-all;
                color: #666666;
              "
            >
              ${body.feedbackLink}
            </p>

            <p>
              Thank you for helping with the
              Swadharma Johari Window assessment.
            </p>

            <p>
              Regards,<br />
              <strong>Swadharma Team</strong>
            </p>

          </div>
        `,
      );

    console.log(
      'JOHARI EMAIL RESULT:',
      result,
    );

    return {
      success: true,
      message:
        'Johari invitation email sent successfully.',
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    };
  }
}