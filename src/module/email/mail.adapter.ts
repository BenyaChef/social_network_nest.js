import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDocument } from '../user/schema/user.schema';

@Injectable()
export class MailAdapter {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, code: string) {
    const url = `https://somesite.com/confirm-email?code=${code}`;

    await this.mailerService.sendMail({
      to: user.accountData.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.accountData.login,
        url,
      },
    });
  }

  async sendUserRecoveryPassword(user: UserDocument, code: string) {
    const url = `https://somesite.com/password-recovery?recoveryCode=${code}`;

    await this.mailerService.sendMail({
      to: user.accountData.email,
      subject: 'Recovery password',
      template: './recovery.password',
      context: {
        name: user.accountData.login,
        url,
      },
    });
  }
}