import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../dto/update.post.dto';
import { PostRepository } from '../infrastructure/post.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { ResultCode } from '../../../enum/result-code.enum';

export class PostUpdateCommand {
  constructor(
    public updateDto: UpdatePostDto,
    public userId: string,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(PostUpdateCommand)
export class PostUpdateUseCase implements ICommandHandler<PostUpdateCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: PostUpdateCommand): Promise<ResultCode> {
    console.log(command);
    const blog = await this.blogRepository.getBlogById(command.blogId)
    if(!blog) return ResultCode.NotFound
    const post = await this.postRepository.getPostById(command.postId)
    if(!post) return ResultCode.NotFound
    if(blog.ownerId !== command.userId) return ResultCode.Forbidden
    const updatePostDto = {
      title: command.updateDto.title,
      shortDescription: command.updateDto.shortDescription,
      content: command.updateDto.content
    }
    await this.postRepository.update(updatePostDto, command.postId)
    return ResultCode.Success
  }
}
