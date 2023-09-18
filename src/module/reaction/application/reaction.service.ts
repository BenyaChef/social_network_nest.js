import { Injectable } from "@nestjs/common";
import { IReactionRepository } from "../infrastructure/interfaces/reaction.repository.interface";

@Injectable()
export class ReactionService {
  constructor(protected reactionRepository: IReactionRepository) {
  }
  // async updateReactionByParentId(parentId: string, status: ReactionStatusEnum,  userId: string): Promise<string> {
  //   const newReaction = new ReactionsComments()
  //
  //     newReaction.userId = userId
  //     newReaction.commentId = parentId
  //     newReaction.reactionStatus = status
  //
  //
  //   await this.reactionRepository.updateReactionByParentId(newReaction)
  //   return newReaction.id
  // }
}