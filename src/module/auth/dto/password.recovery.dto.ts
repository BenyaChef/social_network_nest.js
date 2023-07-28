import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class PasswordRecoveryDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string
}