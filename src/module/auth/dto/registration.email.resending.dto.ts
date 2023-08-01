import { IsEmail } from "class-validator";

export class RegistrationEmailResendingDto {
  @IsEmail()
  email: string
}