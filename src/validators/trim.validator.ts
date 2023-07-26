import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";


@ValidatorConstraint({ name: 'TrimValidator', async: true })
@Injectable()
export class TrimValidator implements ValidatorConstraintInterface {

  validate(value: string): boolean {
    try {
      const result = value.trim()
      return result.length > 0
    }catch (e) {
      return false
    }

  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} cannot consist of only spaces`;
  }
}