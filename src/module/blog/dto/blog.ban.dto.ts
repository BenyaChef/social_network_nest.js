import { IsBoolean, IsString, MinLength } from "class-validator";
import { Trim } from "../../../decorators/trim.decorator";

export class BlogBanDto {
  @IsBoolean()
  isBanned: boolean

  @IsString()
  @Trim()
  @MinLength(20)
  banReason: string

  @IsString()
  @Trim()
  blogId: string
}