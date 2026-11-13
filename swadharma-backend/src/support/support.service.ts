import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { randomBytes } from 'crypto';

import { Repository } from 'typeorm';

import { MailService } from '../mail/mail.service';

import { User } from '../users/entities/user/user';

import { NotificationsService } from '../notifications/notifications.service';

import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';

import { SupportTicket } from './entities/support-ticket.entity';

// =====================================================
// ALLOWED CATEGORIES
// =====================================================
const ALLOWED_CATEGORIES = new Set([
  'Account & Login',
  'Assessments',
  'Horoscope',
  'Reports & ID Card',
  'Technical Issue',
  'Other',
]);

// =====================================================
// HTML ESCAPE
// =====================================================
function escapeHtml(value: unknown): string {
  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value ?? '').replace(
    /[&<>"']/g,
    character => replacements[character],
  );
}

// =====================================================
// SUPPORT SERVICE
// =====================================================
@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailService: MailService,

    private readonly notificationsService: NotificationsService,
  ) {}

  // ===================================================
  // CREATE SUPPORT TICKET
  // ===================================================
  async createTicket(input: CreateSupportTicketDto) {
    const userId = Number(input?.userId);

    const subject =
      typeof input?.subject === 'string'
        ? input.subject.trim()
        : '';

    const category =
      typeof input?.category === 'string'
        ? input.category.trim()
        : '';

    const description =
      typeof input?.description === 'string'
        ? input.description.trim()
        : '';

    // VALIDATE USER
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(
        'A valid userId is required.',
      );
    }

    // VALIDATE SUBJECT
    if (!subject || subject.length > 160) {
      throw new BadRequestException(
        'Subject is required and must be 160 characters or fewer.',
      );
    }

    // VALIDATE CATEGORY
    if (!ALLOWED_CATEGORIES.has(category)) {
      throw new BadRequestException(
        'Please select a valid support category.',
      );
    }

    // VALIDATE DESCRIPTION
    if (!description || description.length > 5000) {
      throw new BadRequestException(
        'Description is required and must be 5,000 characters or fewer.',
      );
    }

    // =================================================
    // GET USER DETAILS
    // =================================================
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'The user for this support request was not found.',
      );
    }

    const requesterName =
      [
        user.firstName,
        user.lastName,
      ]
        .filter(Boolean)
        .join(' ')
        .trim() || 'Swadharma User';

    // =================================================
    // GENERATE TICKET NUMBER
    // =================================================
    const ticketNumber =
      `SWD-${new Date().getFullYear()}-${randomBytes(4)
        .toString('hex')
        .toUpperCase()}`;

    // =================================================
    // CREATE TICKET
    // =================================================
    const ticket = this.ticketRepository.create({
      ticketNumber,
      userId,
      requesterName,
      requesterEmail: user.email,
      subject,
      category,
      description,
      status: 'OPEN',
      priority: 'NORMAL',
      adminNotified: false,
      adminNotifiedAt: null,
    });

    // =================================================
    // SAVE TO POSTGRESQL FIRST
    // =================================================
    const savedTicket =
      await this.ticketRepository.save(ticket);

    console.log(
      'Support ticket saved:',
      savedTicket.ticketNumber,
    );

    // =================================================
    // CREATE IN-APP NOTIFICATION
    // =================================================
    // The ticket is already saved. If notification creation fails,
    // keep the ticket and continue with the admin email flow.
    try {
      await this.notificationsService.create({
        userId,
        title: 'Support ticket submitted',
        message: `Your support ticket ${savedTicket.ticketNumber} has been submitted successfully. Our support team will review your request.`,
        type: 'SUPPORT',
        referenceId: savedTicket.ticketNumber,
      });

      console.log(
        'Support in-app notification created:',
        savedTicket.ticketNumber,
      );
    } catch (notificationError) {
      console.error(
        `Failed to create support notification for ${savedTicket.ticketNumber}:`,
        notificationError,
      );
    }

    // =================================================
    // ADMIN EMAIL CONFIGURATION
    // =================================================
    const adminEmail =
      process.env.SUPPORT_ADMIN_EMAIL?.trim();

    if (!adminEmail) {
      console.error(
        'SUPPORT_ADMIN_EMAIL is not configured.',
      );

      return {
        success: true,
        message:
          'Your support request was saved, but the admin email address is not configured.',
        emailNotificationSent: false,
        ticket: this.toPublicTicket(savedTicket),
      };
    }

    // =================================================
    // EMAIL TEMPLATE
    // =================================================
    const safeDescription =
      escapeHtml(description).replace(
        /\r?\n/g,
        '<br/>',
      );

    const html = `
      <div style="
        font-family:Arial,sans-serif;
        max-width:640px;
        margin:auto;
        padding:28px;
        background:#fffaf5;
        color:#30251f;
      ">

        <h2 style="color:#e85b00;">
          New Swadharma Support Ticket
        </h2>

        <p>
          A user has submitted a support request
          from the Swadharma mobile app.
        </p>

        <table style="
          width:100%;
          border-collapse:collapse;
          background:#ffffff;
          border:1px solid #eadfd6;
        ">

          <tr>
            <td style="padding:10px;">
              <strong>Ticket Number</strong>
            </td>
            <td style="padding:10px;">
              ${escapeHtml(ticketNumber)}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;">
              <strong>User</strong>
            </td>
            <td style="padding:10px;">
              ${escapeHtml(requesterName)}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;">
              <strong>User ID</strong>
            </td>
            <td style="padding:10px;">
              ${userId}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;">
              <strong>Email</strong>
            </td>
            <td style="padding:10px;">
              ${escapeHtml(user.email)}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;">
              <strong>Category</strong>
            </td>
            <td style="padding:10px;">
              ${escapeHtml(category)}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;">
              <strong>Subject</strong>
            </td>
            <td style="padding:10px;">
              ${escapeHtml(subject)}
            </td>
          </tr>

          <tr>
            <td style="padding:10px;vertical-align:top;">
              <strong>Description</strong>
            </td>
            <td style="padding:10px;">
              ${safeDescription}
            </td>
          </tr>

        </table>

        <p style="
          margin-top:22px;
          font-size:13px;
          color:#75685f;
        ">
          Please review this request in the future
          Swadharma Helpdesk admin portal.
        </p>

        <p>
          Regards,<br/>
          <strong>Swadharma Support</strong>
        </p>

      </div>
    `;

    // =================================================
    // SEND ADMIN EMAIL
    // =================================================
    try {
      await this.mailService.sendEmail(
        adminEmail,
        `[Swadharma Support] ${ticketNumber}: ${subject}`,
        html,
      );

      // Update notification status.
      savedTicket.adminNotified = true;
      savedTicket.adminNotifiedAt = new Date();

      await this.ticketRepository.save(savedTicket);

      console.log(
        'Support admin notification sent:',
        ticketNumber,
      );

      return {
        success: true,
        message:
          'Your support request has been submitted. The support team has been notified by email.',
        emailNotificationSent: true,
        ticket: this.toPublicTicket(savedTicket),
      };
    } catch (error) {
      // The ticket remains saved even if email fails.
      console.error(
        `Failed to email admin about ${ticketNumber}:`,
        error,
      );

      return {
        success: true,
        message:
          'Your support request was saved, but the admin email notification could not be sent. Please contact support if the issue is urgent.',
        emailNotificationSent: false,
        ticket: this.toPublicTicket(savedTicket),
      };
    }
  }

  // ===================================================
  // PUBLIC TICKET RESPONSE
  // ===================================================
  private toPublicTicket(ticket: SupportTicket) {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      userId: ticket.userId,
      subject: ticket.subject,
      category: ticket.category,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      adminNotified: ticket.adminNotified,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}