
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { BlogExists } from '../../../decorators/blog.exist.decorator';
import { Trim } from '../../../decorators/trim.decorator';

export class CreatePostDto {
  @IsString()
  @Trim()
  @MaxLength(30)
  title: string;

  @IsString()
  @Trim()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @Trim()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsNotEmpty()
  @BlogExists()
  blogId: string;
}
