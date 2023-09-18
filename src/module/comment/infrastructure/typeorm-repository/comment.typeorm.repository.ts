import { Injectable } from '@nestjs/common';
import { ICommentRepository } from '../interfaces/comment.repository.interface';
import { CommentDbModel } from '../../model/comment-db.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentTypeormRepository implements ICommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  create(newComment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(newComment);
  }

  async delete(commentId: string): Promise<boolean> {
    try {
      const deleteResult = await this.commentRepository.delete({ id: commentId });
      if (!deleteResult.affected) return false;
      return deleteResult.affected > 0;
    } catch (e) {
      return false
    }

  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentEntity | null> {
    try {
      return await this.commentRepository.findOneBy({ id: commentId });
    } catch (e) {
      return null
    }

  }

  async update(comment: CommentEntity): Promise<boolean> {
    const updateResult = await this.commentRepository.update(comment.id, {
      content: comment.content
    });
    if (!updateResult.affected) return false;
    return updateResult.affected > 0;
  }

  updateBanStatus(userId: string, banStatus: boolean) {}
}
