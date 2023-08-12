import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { randomUUID } from 'crypto';
import { UserDocument } from '../../user/schema/user.schema';
import { SessionService } from '../../sessions/application/session.service';
import { Session } from '../../sessions/schema/session.schema';
import { RegistrationDto } from '../dto/registration.dto';
import { MailAdapter } from '../../email/mail.adapter';
import { UserQueryRepository } from '../../user/infrastructure/user.query.repository';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { TokenService } from './jwt.service';
import bcrypt from 'bcrypt';
import { ResultCode } from '../../../enum/result-code.enum';
import { NewPasswordDto } from "../dto/new-password.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected tokenService: TokenService,
    protected sessionService: SessionService,
    protected mailAdapter: MailAdapter,
    protected userRepository: UserRepository,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  async loginUser(ip: string, userAgent: string, userId: string) {
    const deviceId = randomUUID();
    const { accessToken, refreshToken } = await this.tokenService.createJwt(
      userId,
      deviceId,
    );
    const lastActiveDate: any = await this.tokenService.getLastActiveDate(
      refreshToken,
    );

    const newSession: Session = {
      ip,
      title: userAgent,
      lastActiveDate,
      deviceId,
      userId: userId,
    };
    await this.sessionService.createSession(newSession);
    return { accessToken, refreshToken };
  }

  async registrationUser(registrationDto: RegistrationDto) {
    const newUser = await this.userService.registrationUser(registrationDto);
    await this.mailAdapter.sendUserConfirmation(
      newUser,
      newUser.emailInfo.confirmationCode!,
    );
  }

  async registrationResendingEmail(email: string) {
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) throw new BadRequestException('emailIsNotExists');
    if (user.emailInfo.isConfirmed)
      throw new BadRequestException('emailAlreadyIsConfirm');
    const newConfirmedCode = randomUUID();
    await this.userRepository.updateEmailConfirmationCode(
      user.id,
      newConfirmedCode,
    );
    await this.mailAdapter.sendUserConfirmation(user, newConfirmedCode);
    return true;
  }

  async confirmationRegistration(code: string) {
    return this.userService.confirmationUserEmail(code);
  }

  async passwordRecovery(email: string): Promise<ResultCode> {
    const user: UserDocument | null = await this.userQueryRepository.findUserByEmail(email);
    if (!user) return ResultCode.Success;
    const newRecoveryCode = await this.userService.recoveryPassword(user.id)
    await this.mailAdapter.sendUserRecoveryPassword(user, newRecoveryCode);
    return ResultCode.Success;
  }

  async assignNewPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.userQueryRepository.finUserByNewPasswordRecoveryCode(newPasswordDto.recoveryCode)
    if(!user) return ResultCode.BadRequest
    await this.userService.assignNewPassword(newPasswordDto.newPassword, user.id)
    return ResultCode.Success
  }

  async refreshToken(token: string) {
    const jwtPayload: JwtPayload | null = await this.tokenService.decode(token)
    if(!jwtPayload) return ResultCode.NotFound
    const userID
  }
  async validateUser(loginOrEmail: string, password: string,): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userQueryRepository.findUserLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const encodingUser = await bcrypt.compare(password, user.accountData.passwordHash,);
    if (!encodingUser) return null;
    return user;
  }
}
