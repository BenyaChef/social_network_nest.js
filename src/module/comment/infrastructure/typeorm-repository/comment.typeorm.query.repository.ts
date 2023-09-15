import { Injectable } from "@nestjs/common";
import { ICommentQueryRepository } from "../interfaces/comment.query-repository.interface";
import { CommentQueryPaginationDto } from "../../dto/comment.query.pagination.dto";
import { CommentViewModel } from "../../model/comment.view.model";
import { PaginationViewModel } from "../../../../helpers/pagination.view.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "../../entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentTypeormQueryRepository implements ICommentQueryRepository {
  constructor(@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>) {
  }
  getAllCommentsForAllPostsCurrentUser(query: CommentQueryPaginationDto, userId: string) {
  }

  async getCommentById(commentId: string, userId?: string | null): Promise<any | null> {
    const findComment = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.post', 'p')
      .leftJoinAndSelect('c.user', 'u')
      // .leftJoinAndSelect('c.reactions', 'r')
      .where('c.id = :commentId', { commentId})
      .getOne()

    return findComment
  }

  getCommentByParentId(postId: string, query: CommentQueryPaginationDto, userId?: string | null): Promise<PaginationViewModel<CommentViewModel[]> | null> {
    return Promise.resolve(null);
  }

}