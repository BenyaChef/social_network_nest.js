import { IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../decorators/trim.decorator';

export class PostCreateDto {
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
}
