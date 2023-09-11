import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IUserQueryRepository } from "../module/user/infrastructure/interfaces/user.query-repository.interface";
import bcrypt from 'bcrypt';
import { UserEntity } from "../module/user/entities/user.entity";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected userQueryRepository: IUserQueryRepository) {
    super({usernameField: 'loginOrEmail'});
  }

  async validate(loginOrEmail: string, password: string): Promise<UserEntity| null> {
    const user: UserEntity | null = await this.userQueryRepository.findUserLoginOrEmail(loginOrEmail)
    if (!user) throw new UnauthorizedException();
    const encodingUser = await bcrypt.compare(password, user.passwordHash);
    if (!encodingUser) return null;
    return user;
  }
}