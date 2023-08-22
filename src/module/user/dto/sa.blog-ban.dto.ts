import { IsBoolean } from "class-validator";

export class SaBlogBanDto {
  @IsBoolean()
  isBanned
}