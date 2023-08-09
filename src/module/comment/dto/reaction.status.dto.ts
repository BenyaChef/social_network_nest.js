import { IsEnum, IsString } from 'class-validator';
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";

export class ReactionStatusDto {
  @IsEnum(ReactionStatusEnum)
  @IsString()
  likeStatus: ReactionStatusEnum;
}