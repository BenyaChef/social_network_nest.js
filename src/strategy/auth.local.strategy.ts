import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDocument } from "../module/user/schema/user.schema";
import { UserQueryRepository } from "../module/user/infrastructure/user.query.repository";
import bcrypt from 'bcrypt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected userQueryRepository: UserQueryRepository) {
    super({usernameField: 'loginOrEmail'});
  }

  async validate(loginOrEmail: string, password: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userQueryRepository.findUserLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const encodingUser = await bcrypt.compare(password, user.accountData.passwordHash);
    if (!encodingUser) throw new UnauthorizedException();
    return user
  }
}