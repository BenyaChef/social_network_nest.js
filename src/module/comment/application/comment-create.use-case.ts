import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../dto/create.comment.dto';
import { CommentRepository } from '../infrastructure/comment.repository';
import { PostRepository } from '../../post/infrastructure/post.repository';
import { BlogQueryRepository } from '../../blog/infrastructure/blog.query.repository';
import { Comment } from '../schema/comment.schema';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { ResultCode, ResultCodeType } from "../../../enum/result-code.enum";

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
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly userRepository: UserRepository,
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

    const banBlog = await this.blogQueryRepository.findBanUserForBlog(post.blogId, command.userId,);
    if (banBlog && banBlog.isBanned)
      return {
        data: null,
        code: ResultCode.Forbidden,
      };

    const newComment = Comment.createComment(command.createDto.content, command.postId, user);
    const commentId = await this.commentRepository.create(newComment);
    return {
      data: commentId,
      code: ResultCode.Success,
    };
  }
}
