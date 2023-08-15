import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { BlogRepository } from '../infrastructure/blog.repository';
import { ResultCode } from '../../../enum/result-code.enum';

export class BlogUpdateCommand {
  constructor(
    public updateDto: UpdateBlogDto,
    public userId: string,
    public blogId: string,
  ) {}
}

@CommandHandler(BlogUpdateCommand)
export class BlogUpdateUseCase implements ICommandHandler<BlogUpdateCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: BlogUpdateCommand) {
    const blog = await this.blogRepository.getBlogById(command.blogId);
    if (!blog) return ResultCode.NotFound;
    if (blog.ownerId !== command.userId) return ResultCode.Forbidden;
    const updateBlogDto = {
      name: command.updateDto.name,
      websiteUrl: command.updateDto.websiteUrl,
      description: command.updateDto.description,
    };
    try {
      await this.blogRepository.update(updateBlogDto, command.blogId);
      return ResultCode.Success;
    } catch (e) {
      console.log('update blog use case' + e);
      return null;
    }
  }
}