import { Trim } from "../../../decorators/trim.decorator";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class QuestionUpdateDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(10, 500)
  body: string

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return false;
    } else {
      return value.map((a) => a.toString().trim());
    }
  })
  correctAnswers: string[];
}