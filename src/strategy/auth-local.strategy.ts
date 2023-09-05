import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../module/user/schema/user.schema";
import { IUserQueryRepository } from "../module/user/infrastructure/interfaces/user.query-repository.interface";
import bcrypt from 'bcrypt';
import { UserDto } from "../module/user/dto/user.dto";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected userQueryRepository: IUserQueryRepository) {
    super({usernameField: 'loginOrEmail'});
  }

  async validate(loginOrEmail: string, password: string): Promise<UserDto | null> {
    const user = await this.userQueryRepository.findUserLoginOrEmail(loginOrEmail)
    if (!user) throw new UnauthorizedException();
    const encodingUser = await bcrypt.compare(password, user.accountData.passwordHash);
    if (!encodingUser) return null;
    return user;
  }
}