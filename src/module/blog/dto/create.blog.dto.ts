import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Transform } from "class-transformer";
import { trimValue } from "../../../helpers/check.value";




export class CreateBlogDto {

  @IsString({message: 'must by string'})
  @IsNotEmpty({message: 'is not empty'})
  @Transform(({value}) => trimValue(value))
  @Length(3, 15)
  name: string;


  @IsString()
  @Transform(({value}) => trimValue(value))
  @Length(10, 500)
  description: string;

  @IsUrl()
  @Length(5, 100)
  websiteUrl: string;
}
