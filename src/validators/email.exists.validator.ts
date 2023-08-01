import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { UserQueryRepository } from "../module/user/infrastructure/user.query.repository";
import { UserDocument } from "../module/user/schema/user.schema";

@ValidatorConstraint({ name: 'EmailExistsValidation', async: true })
@Injectable()
export class EmailExistsValidation implements ValidatorConstraintInterface {
  constructor(protected userQueryRepository: UserQueryRepository) {}

  async validate(email: string): Promise<boolean> {
    const findBlog: UserDocument | null = await this.userQueryRepository.findUserByEmail(email);
    if (findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {

    return 'This email already exists';
  }
}