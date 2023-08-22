import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateDto } from '../dto/create.post.dto';
import { PostRepository } from '../infrastructure/post.repository';
import { Post } from '../schema/post.schema';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { BlogDocument } from '../../blog/schema/blog.schema';
import { ResultCode } from '../../../enum/result-code.enum';

export class PostCreateCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public createDto: PostCreateDto,
  ) {}
}

@CommandHandler(PostCreateCommand)
export class PostCreateUseCase implements ICommandHandler<PostCreateCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: PostCreateCommand): Promise<ResultCode | string> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      command.blogId,
    );
    if (!blog) return ResultCode.NotFound
    if (blog.isBanned) return ResultCode.NotFound
    if (blog.ownerId !== command.userId) return ResultCode.Forbidden

    const newPost: Post = Post.createPost(command.createDto, blog);
    await this.postRepository.createPost(newPost)
    return newPost.id
  }
}
