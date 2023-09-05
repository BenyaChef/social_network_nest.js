import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "../module/user/infrastructure/interfaces/user.query-repository.interface";
import { UserDto } from "../module/user/dto/user.dto";

@ValidatorConstraint({ name: 'EmailExistsValidation', async: true })
@Injectable()
export class EmailExistsValidation implements ValidatorConstraintInterface {
  constructor(protected userQueryRepository: IUserQueryRepository) {}

  async validate(email: string): Promise<boolean> {
    const findBlog: UserDto | null = await this.userQueryRepository.findUserByEmail(email);
    if (findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {

    return 'This email already exists';
  }
}