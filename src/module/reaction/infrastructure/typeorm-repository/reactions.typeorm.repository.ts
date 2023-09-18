import { Injectable } from "@nestjs/common";
import { IReactionRepository } from "../interfaces/reaction.repository.interface";
import { DataSource,  } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ReactionsComments } from "../../entities/reactions-comments.entity";
import { ReactionsPosts } from "../../entities/reactions-posts.entity";


@Injectable()
export class ReactionsTypeormRepository implements IReactionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  updateBanStatus(userId: string, banStatus: boolean) {
  }

 async updateReaction(newReaction: ReactionsComments | ReactionsPosts) {
    return this.dataSource.manager.save(newReaction)
 }

}