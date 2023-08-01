import { registerDecorator, ValidationOptions } from "class-validator";
import { EmailExistsValidation } from "../validators/email.exists.validator";

export function EmailExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'EmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailExistsValidation,
    });
  };
}
