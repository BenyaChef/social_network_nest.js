import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "../module/user/infrastructure/interfaces/user.query-repository.interface";
import { UserEntity } from "../module/user/entities/user.entity";

@ValidatorConstraint({ name: 'LoginExistsValidation', async: true })
@Injectable()
export class LoginExistsValidation implements ValidatorConstraintInterface {
  constructor(protected userQueryRepository: IUserQueryRepository) {}

  async validate(login: string): Promise<boolean> {
    const findBlog: UserEntity | null = await this.userQueryRepository.findUserByLogin(login);
    if (findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'This login already exists';
  }
}