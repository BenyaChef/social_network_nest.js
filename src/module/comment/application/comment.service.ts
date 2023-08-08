import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { PostRepository } from "../../post/infrastructure/post.repository";
import { Comment } from "../schema/comment.schema";

@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected userRepository: UserRepository,
    protected postRepository: PostRepository
  ) {}

  async createComment(content: string, postId: string, userId: string): Promise<string | null> {
    const user = await this.userRepository.getUserById(userId);
    if(!user) return null
    const post = await this.postRepository.getPostById(postId)
    if(!post) return null
    const newComment: Comment = Comment.createComment(content, postId, user)
    return this.commentRepository.save(newComment)
  }

  async update(content: string, userId: string, commentId: string) {
    const comment = await this.commentRepository.getCommentById(commentId)
    if(!comment) return null
    if(userId !== comment.userId) return null
    comment.update(content)
    return this.commentRepository.update(comment)
  }
}