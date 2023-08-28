import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { randomUUID } from 'crypto';
import { UserDocument } from '../../user/schema/user.schema';
import { SessionService } from '../../sessions/application/session.service';
import { MailAdapter } from '../../email/mail.adapter';
import { UserQueryRepository } from '../../user/infrastructure/user.query.repository';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { TokenService } from './jwt.service';
import { ResultCode } from '../../../enum/result-code.enum';
import { NewPasswordDto } from "../dto/new-password.dto";
import { JwtPayload } from "jsonwebtoken";
import { SessionQueryRepository } from "../../sessions/infrastructure/session.query.repository";

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected tokenService: TokenService,
    protected sessionService: SessionService,
    protected sessionQueryRepository: SessionQueryRepository,
    protected mailAdapter: MailAdapter,
    protected userRepository: UserRepository,
    protected userQueryRepository: UserQueryRepository,
  ) {}


  async registrationResendingEmail(email: string) {
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) throw new BadRequestException('emailIsNotExists');
    if (user.emailInfo.isConfirmed) throw new BadRequestException('emailAlreadyIsConfirm');
    
    const newConfirmedCode = randomUUID();
    this.mailAdapter.sendUserConfirmation(user.accountData.email, user.accountData.login, newConfirmedCode)
    return this.userRepository.updateEmailConfirmationCode(user.id,newConfirmedCode);
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
    if(!jwtPayload) return null
    const userId = jwtPayload.sub!
    const deviceId = jwtPayload.deviceId
    const lastActiveDate = new Date(jwtPayload.iat! * 1000).toISOString()
    const user = await this.userQueryRepository.getUserByID(userId)
    if(!user) return null
    const device = await this.sessionQueryRepository.getDeviceByDateUserIdAndDeviceId(lastActiveDate, user.id, deviceId)
    if(!device) return null
    const newTokens = await this.tokenService.createJwt(user.id)
    const newLastActiveDate = await this.tokenService.getLastActiveDate(newTokens.refreshToken)
    await this.sessionService.updateLastActiveDate(user.id, deviceId, newLastActiveDate)
    return newTokens
  }

}
