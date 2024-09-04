import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AUTH_CONSTANTS } from 'src/common/auth-constants';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${process.env.RESET_PASS_URL}${resetToken}`;
    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_USER,
      subject: AUTH_CONSTANTS.PASSWORD_RESET_SUBJECT,
      template: 'reset-password',
      context: {
        name: email.split('@')[0],
        resetUrl,
      },
    });
  }
}
