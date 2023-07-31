import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDocument } from '../user/schema/user.schema';

@Injectable()
export class MailAdapter {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, code: string) {
    const url = `example.com/auth/confirm?token=${code}`;

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
}