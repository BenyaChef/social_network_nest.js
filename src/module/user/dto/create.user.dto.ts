import { IsEmail, IsString, Length, Matches } from "class-validator";
import { Trim } from '../../../decorators/trim.decorator';

export class CreateUserDto {
  @IsString()
  @Trim()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}