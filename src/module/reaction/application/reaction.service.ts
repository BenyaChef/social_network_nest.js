import { Injectable } from "@nestjs/common";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { randomUUID } from "crypto";
import { IReactionRepository } from "../infrastructure/interfaces/reaction.repository.interface";

@Injectable()
export class ReactionService {
  constructor(protected reactionRepository: IReactionRepository) {
  }

  async updateReactionByParentId(parentId: string, status: ReactionStatusEnum,  userId: string): Promise<string> {
    const newReaction = {
      id: randomUUID(),
      userId: userId,
      parentId: parentId,
      status: status,
      addedAt: new Date().toISOString()
    }
    await this.reactionRepository.updateReactionByParentId(newReaction)
    return newReaction.id
  }
}