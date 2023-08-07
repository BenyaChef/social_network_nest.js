import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDocument } from "../module/user/schema/user.schema";


import { AuthService } from "../module/auth/application/auth.service";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected authService: AuthService) {
    super({usernameField: 'loginOrEmail'});
  }

  async validate(loginOrEmail: string, password: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.authService.validateUser(loginOrEmail, password)
    if (!user) throw new UnauthorizedException();
    return user
  }
}