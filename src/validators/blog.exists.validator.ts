import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { IBlogRepository } from "../module/blog/infrastructure/interfaces/blog-repository.interface";


@ValidatorConstraint({ name: 'BlogExistsValidation', async: true })
@Injectable()
export class BlogExistsValidation implements ValidatorConstraintInterface {
  constructor(protected blogRepository: IBlogRepository) {}

  async validate(blogId: string): Promise<boolean> {
    const findBlog = await this.blogRepository.getBlogById(blogId);
    if (!findBlog) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Blog not found';
  }
}