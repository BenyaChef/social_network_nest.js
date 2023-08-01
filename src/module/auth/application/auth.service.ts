import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from '../../user/application/user.service';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from './jwt.service';
import { randomUUID } from 'crypto';
import {  UserDocument } from "../../user/schema/user.schema";
import { SessionService } from "../../sessions/application/session.service";
import { Session } from "../../sessions/schema/session.schema";
import { RegistrationDto } from "../dto/registration.dto";
import { MailAdapter } from "../../email/mail.adapter";
import { UserQueryRepository } from "../../user/infrastructure/user.query.repository";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { exceptionHandler } from "../../../exception/exception.handler";
import { ExceptionMessageEnum } from "../../../enum/exception.message.enum";
import { FieldsEnum } from "../../../enum/fields.enum";

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
    protected sessionService: SessionService,
    protected mailAdapter: MailAdapter,
    protected userRepository: UserRepository,
    protected userQueryRepository: UserQueryRepository
  ) {}

  async loginUser(loginDto: LoginDto, ip: string, userAgent: string) {
    const user: UserDocument | null = await this.userService.checkCredentials(loginDto)
    if(!user) return null

    const deviceId = randomUUID()
    const {accessToken, refreshToken} = await this.jwtService.createJwt(user.id, deviceId)
    const lastActiveDate = await this.jwtService.getIssuedAtFromRefreshToken(refreshToken)

    const newSession: Session = {
      ip,
      title: userAgent,
      lastActiveDate,
      deviceId,
      userId: user.id
    }
    await this.sessionService.createSession(newSession)
    return {accessToken, refreshToken}

  }

  async registrationUser(registrationDto: RegistrationDto) {
    const newUser = await this.userService.registrationUser(registrationDto)
    await this.mailAdapter.sendUserConfirmation(newUser, newUser.emailInfo.confirmationCode!)
  }

  async registrationResendingEmail(email: string) {
    const user = await this.userQueryRepository.findUserByEmail(email)
    if(!user) throw new BadRequestException(exceptionHandler(ExceptionMessageEnum.emailExists, FieldsEnum.email))
    if(user.emailInfo.isConfirmed) throw new BadRequestException(exceptionHandler(ExceptionMessageEnum.emailAlreadyConfirm, FieldsEnum.email))
    const newConfirmedCode = randomUUID()
    await this.userRepository.updateEmailConfirmationCode(user.id, newConfirmedCode)
    await this.mailAdapter.sendUserConfirmation(user, newConfirmedCode)
    return true
  }

  async confirmationRegistration(code: string) {
      return this.userService.confirmationUserEmail(code)
  }
}