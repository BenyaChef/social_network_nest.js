import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import bcrypt from 'bcrypt';
import { User, UserDocument } from '../schema/user.schema';
import { UserRepository } from '../infrastructure/user.repository';
import { UserQueryRepository } from '../infrastructure/user.query.repository';
import { LoginDto } from '../../auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    protected userRepository: UserRepository,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  async createUser(createDto: CreateUserDto) {
    const passwordHash = await this.generatorHash(createDto.password);
    const newUser = User.createUser(createDto, passwordHash);
    return this.userRepository.createUser(newUser);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }

  async checkCredentials(
    loginDto: LoginDto,
  ): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userQueryRepository.findUserLoginOrEmail(loginDto);
    if (!user) return null;
    const encodingUser = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!encodingUser) return null;
    return user;
  }

  private async generatorHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }


}
