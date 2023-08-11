import { IsString, IsUUID, Length } from "class-validator";

export class NewPasswordDto {
  @IsString()
  @Length(6, 20)
  newPassword: string

  @IsString()
  @IsUUID()
  recoveryCode: string
}