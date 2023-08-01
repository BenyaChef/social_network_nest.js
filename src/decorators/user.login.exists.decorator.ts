import { registerDecorator, ValidationOptions } from "class-validator";
import { LoginExistsValidation } from "../validators/login.exists.validator";

export function LoginExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'LoginExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: LoginExistsValidation,
    });
  };
}
