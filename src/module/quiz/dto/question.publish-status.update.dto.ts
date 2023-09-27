import { IsBoolean, IsNotEmpty } from "class-validator";

export class PublishStatusUpdateDto {

  @IsBoolean()
  @IsNotEmpty()
  published: boolean
}