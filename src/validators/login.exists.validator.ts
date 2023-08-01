import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { UserQueryRepository } from "../module/user/infrastructure/user.query.repository";
import { UserDocument } from "../module/user/schema/user.schema";

@ValidatorConstraint({ name: 'LoginExistsValidation', async: true })
@Injectable()
export class LoginExistsValidation implements ValidatorConstraintInterface {
  constructor(protected userQueryRepository: UserQueryRepository) {}

  async validate(login: string): Promise<boolean> {
    const findBlog: UserDocument | null = await this.userQueryRepository.findUserByLogin(login);
    if (findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {

    return 'This login already exists';
  }
}