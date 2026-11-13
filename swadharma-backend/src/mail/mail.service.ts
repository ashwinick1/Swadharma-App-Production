import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:
          Number(process.env.SMTP_PORT) || 587,
        secure:
          process.env.SMTP_SECURE === 'true',

        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ) {
    return await this.transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        process.env.SMTP_USER,

      to,
      subject,
      html,
    });
  }
}