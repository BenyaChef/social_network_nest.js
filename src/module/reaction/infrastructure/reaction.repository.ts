import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Reaction, ReactionDocument } from "../schema/reaction.schema";
import { Model } from "mongoose";

@Injectable()
export class ReactionRepository {
  constructor(@InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>) {
  }

  async updateReactionByParentId(newReaction: Reaction) {

    return this.reactionModel.updateOne(
      { parentId: newReaction.parentId, userId: newReaction.userId },
      { $set: newReaction },
      { upsert: true },
    );
  }

  async updateBanStatus(userId: string, banStatus: boolean) {
    return this.reactionModel.updateOne({userId: userId} , {$set: {isUserBanned: banStatus}})
  }
}