import { IsBoolean, IsString, MinLength } from "class-validator";

export class UserBanDto {
  @IsBoolean()
  isBanned: boolean

  @IsString()
  @MinLength(20)
  banReason: string
}