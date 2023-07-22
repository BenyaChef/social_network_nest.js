import {IsString, IsUrl, Length} from "class-validator";



export class CreateBlogDto {
  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsUrl()
  @Length(5, 100)
  websiteUrl: string;
}
