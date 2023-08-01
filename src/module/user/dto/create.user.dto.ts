import { IsEmail, IsString, Length, Matches } from "class-validator";
import { Trim } from '../../../decorators/trim.decorator';
import { LoginExists } from "../../../decorators/user.login.exists.decorator";
import { EmailExists } from "../../../decorators/user.email.exists.decorator";

export class CreateUserDto {
  @IsString()
  @Trim()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @LoginExists()
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;

  @IsEmail()
  @EmailExists()
  email: string;
}