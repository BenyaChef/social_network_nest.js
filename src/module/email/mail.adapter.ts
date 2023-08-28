import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from "../user/schema/user.schema";

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

  async sendUserRecoveryPassword(user: User, code: string) {
    const url = `https://somesite.com/password-recovery?recoveryCode=${code}`;

    await this.mailerService.sendMail({
      to: user.accountData.email,
      subject: 'Recovery password',
      template: './recovery',
      context: {
        login: user.accountData.login,
        url,
      },
    });
  }
}