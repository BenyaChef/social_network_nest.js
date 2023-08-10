import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { HydratedDocument } from "mongoose";

export type ReactionDocument = HydratedDocument<Reaction>

@Schema()
export class Reaction {
  @Prop({required: true, type: String})
  parentId: string

  @Prop({required: true, type: String})
  userId: string

  @Prop({required: true, type: String})
  userLogin: string

  @Prop({required: true, type: String, enum: ReactionStatusEnum})
  reactionStatus: ReactionStatusEnum

  @Prop({required: true, type: String})
  addedAt: string

  static newReaction(parentId: string, status: ReactionStatusEnum, userId: string, userLogin: string): Reaction {
    const newReaction = new Reaction()
    newReaction.parentId = parentId
    newReaction.userId = userId
    newReaction.userLogin = userLogin
    newReaction.addedAt = new Date().toISOString()
    newReaction.reactionStatus = status
    return newReaction
  }
 }

export const ReactionSchema = SchemaFactory.createForClass(Reaction)
ReactionSchema.statics.newReaction = Reaction.newReaction
