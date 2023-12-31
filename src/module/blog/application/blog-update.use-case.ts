import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { ResultCode } from '../../../enum/result-code.enum';
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";

export class BlogUpdateCommand {
  constructor(
    public updateDto: UpdateBlogDto,
    public blogId: string,
  ) {}
}

@CommandHandler(BlogUpdateCommand)
export class BlogUpdateUseCase implements ICommandHandler<BlogUpdateCommand> {
  constructor(private readonly blogRepository: IBlogRepository) {}

  async execute(command: BlogUpdateCommand) {
    const blog = await this.blogRepository.getBlogById(command.blogId);
    if (!blog) return ResultCode.NotFound;
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