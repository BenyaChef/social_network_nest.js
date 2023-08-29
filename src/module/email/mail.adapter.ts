import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailAdapter {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, login: string, code: string) {
    const url = `https://somesite.com/confirm-email?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Registration confirmation',
      template: './confirmation',
      context: {
        login: login,
        url,
      },
    });
  }

  async sendUserRecoveryPassword(email: string, login: string, code: string) {
    const url = `https://somesite.com/password-recovery?recoveryCode=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recovery password',
      template: './recovery',
      context: {
        login: login,
        url,
      },
    });
  }
}