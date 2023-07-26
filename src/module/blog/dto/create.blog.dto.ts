import { IsString, IsUrl, Length } from 'class-validator';

import { Trim } from '../../../decorators/trim.decorator';

export class CreateBlogDto {
  @IsString()
  @Trim()
  @Length(3, 15)
  name: string;

  @IsString()
  @Trim()
  @Length(10, 500)
  description: string;

  @IsUrl()
  @Length(5, 100)
  websiteUrl: string;
}
