import { IsString, IsUUID } from "class-validator";

export class ConfirmationCodeDto {
  @IsString()
  @IsUUID()
  code: string
}