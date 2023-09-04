import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../dto/create.comment.dto';
import { CommentRepository } from '../infrastructure/comment.repository';
import { Comment } from '../schema/comment.schema';
import { ResultCode, ResultCodeType } from "../../../enum/result-code.enum";
import { IBlogQueryRepository } from "../../blog/infrastructure/interfaces/blog.query-repository.interface";
import { IPostRepository } from "../../post/infrastructure/interfaces/post.repository.interface";
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { IBlogRepository } from "../../blog/infrastructure/interfaces/blog-repository.interface";
import { ICommentRepository } from "../infrastructure/interfaces/comment.repository.interface";
import { CommentDbModel } from "../model/comment-db.model";
import { randomUUID } from "crypto";

export class CommentCreateCommand {
  constructor(
    public userId: string,
    public postId: string,
    public createDto: CreateCommentDto,
  ) {}
}

@CommandHandler(CommentCreateCommand)
export class CommentCreateUseCase
  implements ICommandHandler<CommentCreateCommand>
{
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly postRepository: IPostRepository,
    private readonly blogQueryRepository: IBlogQueryRepository,
    private readonly userRepository: IUserRepository,
    private readonly blogRepository: IBlogRepository
  ) {}

  async execute(command: CommentCreateCommand): Promise<ResultCodeType> {
    const post = await this.postRepository.getPostById(command.postId);
    if (!post)
      return {
        data: null,
        code: ResultCode.NotFound,
      };

    const user = await this.userRepository.getUserById(command.userId);
    if (!user)
      return {
        data: null,
        code: ResultCode.NotFound,
      };

    const blog = await this.blogRepository.getBlogById(post.blogId)
    if(!blog) return {
      data: null,
      code: ResultCode.NotFound,
    };

    const banBlog = await this.blogQueryRepository.findBanUserForBlog(post.blogId, command.userId);
    if (banBlog && banBlog.isBanned)
      return {
        data: null,
        code: ResultCode.Forbidden,
      };

    const newComment: CommentDbModel = {
      id: randomUUID(),
      postId: post.id,
      userId: user.id,
      content: command.createDto.content,
      createdAt: new Date().toISOString()
    }
    await this.commentRepository.create(newComment);
    return {
      data: newComment.id,
      code: ResultCode.Success,
    };
  }
}
