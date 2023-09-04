import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";

export class ReactionDbModel {
  id: string
  userId: string
  parentId: string
  status: ReactionStatusEnum
  addedAt: string
}