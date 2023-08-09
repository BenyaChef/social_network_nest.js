import { Injectable } from "@nestjs/common";
import { ReactionRepository } from "../infrastructure/reaction.repository";
import { UserDocument } from "../../user/schema/user.schema";
import { Reaction } from "../schema/reaction.schema";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";

@Injectable()
export class ReactionService {
  constructor(protected reactionRepository: ReactionRepository) {
  }

  async updateReactionByParentId(parentId: string, status: ReactionStatusEnum,  user: UserDocument,) {
    const newReaction: Reaction = Reaction.newReaction(parentId, status, user.id, user.accountData.login)
    return this.reactionRepository.updateReactionByParentId(newReaction)
  }
}