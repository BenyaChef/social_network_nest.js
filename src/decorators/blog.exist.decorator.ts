import { registerDecorator, ValidationOptions } from 'class-validator';
import { BlogExistsValidation } from '../validators/blog.exists.validator';

export function BlogExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'BlogExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogExistsValidation,
    });
  };
}
