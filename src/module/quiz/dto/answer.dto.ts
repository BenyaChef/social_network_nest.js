import { Trim } from "../../../decorators/trim.decorator";
import {  IsNotEmpty, IsString } from "class-validator";

export class AnswerDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  answer: string
}