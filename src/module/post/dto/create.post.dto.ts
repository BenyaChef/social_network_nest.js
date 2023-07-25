import { Transform } from "class-transformer";
import { trimValue } from "../../../helpers/check.value";

export class CreatePostDto {
  @Transform(({value}) => trimValue(value))
  title: string;
  shortDescription: string;
  content: string;

  // @Validate()
  blogId: string;
}
