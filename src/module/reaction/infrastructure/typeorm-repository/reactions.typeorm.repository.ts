import { Injectable } from "@nestjs/common";
import { IReactionRepository } from "../interfaces/reaction.repository.interface";
import { ReactionDbModel } from "../../model/reaction.db.model";

import { DataSource,  } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ReactionsComments } from "../../entities/reactions.entity";


@Injectable()
export class ReactionsTypeormRepository implements IReactionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  updateBanStatus(userId: string, banStatus: boolean) {
  }

  updateReactionByPostId(newReaction: ReactionDbModel) {
  }

 async updateReactionByCommentId(newReaction: ReactionsComments) {

     const res = await this.dataSource.createQueryBuilder()
        .insert()
        .into(ReactionsComments)
        .values({
          commentId: newReaction.commentId,
          userId: newReaction.userId,
          reactionStatus: newReaction.reactionStatus,
          createdAt: newReaction.createdAt,
        })
        .orUpdate(['reaction_status'],['comment_id', 'user_id'])
        .execute()
   console.log(res);
 }
}