import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../infrastructure/post.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { ResultCode } from '../../../enum/result-code.enum';

export class PostDeleteCommand {
  constructor(
    public userId: string,
    public postId: string,
    public blogId: string,
  ) {}
}

@CommandHandler(PostDeleteCommand)
export class PostDeleteUseCase implements ICommandHandler<PostDeleteCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: PostDeleteCommand): Promise<ResultCode> {
    const blog = await this.blogRepository.getBlogById(command.blogId);
    if (!blog) return ResultCode.NotFound;

    const post = await this.postRepository.getPostById(command.postId);
    if (!post) return ResultCode.NotFound;
    if (blog.ownerId !== command.userId) return ResultCode.Forbidden;

    const deleteResult = await this.postRepository.deletePost(command.postId);
    if (!deleteResult) return ResultCode.NotFound;
    return ResultCode.Success;
  }
}