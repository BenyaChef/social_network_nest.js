import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { IReactionRepository } from "../interfaces/reaction.repository.interface";
import { ReactionDbModel } from "../../model/reaction.db.model";
import { ReactionsComments } from "../../entities/reactions-comments.entity";
import { ReactionsPosts } from "../../entities/reactions-posts.entity";

@Injectable()
export class ReactionSqlRepository implements IReactionRepository{
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  updateBanStatus(userId: string, banStatus: boolean) {
  }

 async updateReaction(newReaction: ReactionsComments | ReactionsPosts) {
     await this.dataSource.query(`
    INSERT INTO "Reactions" ("ParentId", "UserId", "Status","Id", "AddedAt")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("ParentId", "UserId") DO UPDATE SET "Status" = EXCLUDED."Status";
    `, [newReaction.parentId, newReaction.userId, newReaction.reactionStatus, newReaction.id, newReaction.createdAt])
   return true
  }

  getReactionsById(reactionsId: string) {
  }
}
