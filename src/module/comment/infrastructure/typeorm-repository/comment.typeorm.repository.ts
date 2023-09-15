import { Injectable } from "@nestjs/common";
import { ICommentRepository } from "../interfaces/comment.repository.interface";
import { CommentDbModel } from "../../model/comment-db.model";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../../entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentTypeormRepository implements ICommentRepository {
  constructor(@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>) {
  }
  create(newComment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(newComment)
  }

  delete(commentId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  getCommentById(commentId: string, userId?: string): Promise<CommentDbModel | null> {
    return Promise.resolve(null);
  }

  update(comment: CommentDbModel): Promise<boolean> {
    return Promise.resolve(false);
  }

  updateBanStatus(userId: string, banStatus: boolean) {
  }

}