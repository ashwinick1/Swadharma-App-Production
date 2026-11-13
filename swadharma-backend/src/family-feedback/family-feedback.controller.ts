import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
} from '@nestjs/common';
import { FamilyFeedbackService } from './family-feedback.service';
import type { FamilyFeedbackAnswers } from './family-feedback.service';

function escapeHtml(value: unknown): string {
  const text = String(value ?? '');
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (character) => entities[character]);
}

@Controller('family-feedback')
export class FamilyFeedbackController {
  constructor(private readonly familyFeedbackService: FamilyFeedbackService) {}

  @Post('invitation')
  async createInvitation(
    @Body()
    body: {
      participantId?: number | string;
      name?: string;
      email?: string;
      relationship?: string;
    },
  ) {
    const participantId = Number(body?.participantId);
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const relationship =
      typeof body?.relationship === 'string' ? body.relationship.trim() : '';
    const publicUrl = process.env.JOHARI_PUBLIC_URL;

    if (!Number.isInteger(participantId) || participantId <= 0) {
      throw new BadRequestException('A valid participantId is required.');
    }
    if (!name || !email || !relationship) {
      throw new BadRequestException('Name, email, and relationship are required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Please provide a valid email address.');
    }
    if (!publicUrl) {
      throw new BadRequestException('JOHARI_PUBLIC_URL is not configured.');
    }

    return this.familyFeedbackService.createInvitation(
      participantId,
      name,
      email,
      relationship,
      publicUrl,
    );
  }

  @Get('feedback/:token')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getFeedbackForm(@Param('token') token: string): Promise<string> {
    const invitation = await this.familyFeedbackService.getInvitation(token);

    if (invitation.submitted) {
      return this.messagePage(
        'Feedback already submitted',
        'Thank you. Feedback for this invitation has already been submitted.',
      );
    }

    const relationship = escapeHtml(invitation.relationship);
    const participantName = escapeHtml(invitation.name);
    const safeToken = encodeURIComponent(token);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Swadharma - Family Feedback</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px 14px; background: #fff7ed; color: #2b211b; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width: 760px; margin: 0 auto; }
    .header { padding: 26px 24px; background: #ffffff; border: 1px solid #f0dfd0; border-radius: 16px; margin-bottom: 18px; }
    .brand { margin: 0 0 8px; color: #d97706; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
    h1 { margin: 0 0 12px; font-size: 27px; line-height: 1.25; }
    .intro { margin: 0; color: #66574d; line-height: 1.65; }
    .meta { margin-top: 16px; padding: 12px 14px; background: #fff0e3; border-radius: 10px; color: #574334; font-size: 14px; }
    form { padding: 24px; background: #ffffff; border: 1px solid #f0dfd0; border-radius: 16px; }
    .question { margin: 0 0 24px; }
    .question-label { display: block; margin-bottom: 9px; font-size: 15px; line-height: 1.5; font-weight: 700; }
    .number { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; margin-right: 7px; border-radius: 50%; background: #fff0e3; color: #b45309; font-size: 12px; }
    textarea { display: block; width: 100%; min-height: 94px; padding: 12px; border: 1px solid #d9c8b8; border-radius: 9px; font: inherit; line-height: 1.5; resize: vertical; background: #fffdfa; }
    textarea:focus, input:focus { outline: 2px solid #fed7aa; border-color: #d97706; }
    .hint { margin: 7px 0 0; color: #806e60; font-size: 12px; line-height: 1.5; }
    .strength-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .strength-option { display: flex; gap: 9px; align-items: flex-start; padding: 11px; border: 1px solid #ead8c8; border-radius: 9px; background: #fffdfa; font-size: 14px; line-height: 1.35; }
    .strength-option input { margin-top: 2px; accent-color: #d97706; }
    button { width: 100%; border: 0; border-radius: 10px; padding: 15px 20px; background: #d97706; color: #fff; font-size: 16px; font-weight: 800; cursor: pointer; }
    button:disabled { opacity: .65; cursor: wait; }
    #status { margin-top: 16px; font-size: 14px; line-height: 1.5; }
    .error { color: #b91c1c; }
    @media (max-width: 520px) { body { padding: 14px 9px; } .header, form { padding: 19px 15px; } h1 { font-size: 23px; } .strength-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main class="container">
    <section class="header">
      <p class="brand">Swadharma</p>
      <h1>Family Feedback Questionnaire</h1>
      <p class="intro">Please answer these questions based on your observations of the person. Your honest feedback can help them recognise their strengths, qualities, and growth opportunities. All 10 questions are required.</p>
      <div class="meta"><strong>Participant:</strong> ${participantName}<br /><strong>Your relationship:</strong> ${relationship}</div>
    </section>

    <form id="feedbackForm">
      <div class="question">
        <label class="question-label" for="childhoodActivities"><span class="number">1</span>What activities did the person enjoy most during childhood?</label>
        <textarea id="childhoodActivities" name="childhoodActivities" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="childhoodTalents"><span class="number">2</span>What natural talents or special abilities did you notice during childhood?</label>
        <textarea id="childhoodTalents" name="childhoodTalents" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="childhoodCreativity"><span class="number">3</span>Was the person creative or imaginative as a child? Please share an example.</label>
        <textarea id="childhoodCreativity" name="childhoodCreativity" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="childhoodLeadershipHelping"><span class="number">4</span>Did the person show leadership, enjoy helping others, or like solving problems during childhood?</label>
        <textarea id="childhoodLeadershipHelping" name="childhoodLeadershipHelping" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="childhoodLearning"><span class="number">5</span>What activities or skills did the person learn easily as a child?</label>
        <textarea id="childhoodLearning" name="childhoodLearning" required></textarea>
      </div>
      <div class="question">
        <span class="question-label"><span class="number">6</span>What do you consider the person's greatest strengths today? Select all that apply.</span>
        <div class="strength-grid">
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Creativity" />Creativity</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Leadership" />Leadership</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Communication" />Communication</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Empathy" />Empathy and understanding</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Problem-solving" />Problem-solving</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Adaptability" />Adaptability</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Responsibility" />Responsibility</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Curiosity" />Curiosity and learning</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Teamwork" />Teamwork</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Patience" />Patience</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Organisation" />Organisation</label>
          <label class="strength-option"><input type="checkbox" name="currentStrengths" value="Persistence" />Persistence</label>
        </div>
      </div>
      <div class="question">
        <label class="question-label" for="currentTalents"><span class="number">7</span>What talents or abilities do you notice in the person now?</label>
        <textarea id="currentTalents" name="currentTalents" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="positiveQualities"><span class="number">8</span>What positive qualities do you appreciate most about the person?</label>
        <textarea id="positiveQualities" name="positiveQualities" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="continuingInterests"><span class="number">9</span>Which childhood interests or strengths can you still see in the person today?</label>
        <textarea id="continuingInterests" name="continuingInterests" required></textarea>
      </div>
      <div class="question">
        <label class="question-label" for="hiddenStrengths"><span class="number">10</span>What hidden strengths might the person not recognise, or what could they develop further?</label>
        <textarea id="hiddenStrengths" name="hiddenStrengths" required></textarea>
      </div>
      <button type="submit" id="submitButton">Submit Family Feedback</button>
      <p id="status" role="status" aria-live="polite"></p>
    </form>
  </main>

  <script>
    (function () {
      const form = document.getElementById('feedbackForm');
      const button = document.getElementById('submitButton');
      const status = document.getElementById('status');
      const token = '${safeToken}';
      const textFields = [
        'childhoodActivities', 'childhoodTalents', 'childhoodCreativity',
        'childhoodLeadershipHelping', 'childhoodLearning', 'currentTalents',
        'positiveQualities', 'continuingInterests', 'hiddenStrengths'
      ];

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        status.textContent = '';
        status.className = '';

        const currentStrengths = Array.from(
          document.querySelectorAll('input[name="currentStrengths"]:checked')
        ).map(function (input) { return input.value; });

        if (currentStrengths.length === 0) {
          status.textContent = 'Please select at least one current strength for question 6.';
          status.className = 'error';
          return;
        }

        const answers = {};
        textFields.forEach(function (field) {
          answers[field] = document.getElementById(field).value.trim();
        });
        answers.currentStrengths = currentStrengths;

        button.disabled = true;
        button.textContent = 'Submitting...';
        try {
          const response = await fetch('/family-feedback/feedback/' + token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(answers)
          });
          const result = await response.json().catch(function () { return {}; });
          if (!response.ok) {
            const message = Array.isArray(result.message) ? result.message.join(', ') : result.message;
            throw new Error(message || 'Unable to submit feedback. Please try again.');
          }
          document.querySelector('.container').innerHTML =
            '<section class="header" style="text-align:center;margin-top:40px">' +
            '<p class="brand">Swadharma</p><h1>Thank You!</h1>' +
            '<p class="intro">Your family feedback has been submitted successfully.</p></section>';
        } catch (error) {
          status.textContent = error && error.message ? error.message : 'Unable to submit feedback. Please try again.';
          status.className = 'error';
          button.disabled = false;
          button.textContent = 'Submit Family Feedback';
        }
      });
    })();
  </script>
</body>
</html>`;
  }

  @Post('feedback/:token')
  async submitFeedback(
    @Param('token') token: string,
    @Body() body: FamilyFeedbackAnswers,
  ) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Please provide your family feedback answers.');
    }

    // The service performs the full field validation before saving.
    return this.familyFeedbackService.submitFeedback(token, body);
  }

  private messagePage(title: string, message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 24px 14px; background: #fff7ed; color: #2b211b; font-family: Arial, Helvetica, sans-serif; }
    main { max-width: 620px; margin: 70px auto; padding: 30px; background: #fff; border: 1px solid #f0dfd0; border-radius: 16px; text-align: center; }
    h1 { color: #d97706; }
    p { color: #66574d; line-height: 1.6; }
  </style>
</head>
<body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></main></body>
</html>`;
  }
}