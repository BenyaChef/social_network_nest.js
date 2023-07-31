import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { BlogRepository } from "../module/blog/infrastructure/blog.repository";

@ValidatorConstraint({ name: 'BlogExistsValidation', async: true })
@Injectable()
export class BlogExistsValidation implements ValidatorConstraintInterface {
  constructor(protected blogRepository: BlogRepository) {}

  async validate(blogId: string): Promise<boolean> {
    const findBlog = await this.blogRepository.getBlogById(blogId);
    if (!findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {

    return 'Blog not found';
  }
}