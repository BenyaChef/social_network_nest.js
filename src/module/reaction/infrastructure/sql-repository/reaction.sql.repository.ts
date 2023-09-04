import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { IReactionRepository } from "../interfaces/reaction.repository.interface";
import { ReactionDbModel } from "../../model/reaction.db.model";

@Injectable()
export class ReactionSqlRepository implements IReactionRepository{
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  updateBanStatus(userId: string, banStatus: boolean) {
  }

 async updateReactionByParentId(newReaction: ReactionDbModel) {
     await this.dataSource.query(`
    INSERT INTO Reaction ("ParentId", "UserId", "Status")
        VALUES ($1, $2, $3)
        ON CONFLICT ("ParentId", "UserId") DO UPDATE SET "Status" = EXCLUDED."Status";
    `, [newReaction.parentId, newReaction.userId, newReaction.status])
   return true
  }
}
