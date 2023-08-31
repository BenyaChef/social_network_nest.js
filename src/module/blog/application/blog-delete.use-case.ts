import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogRepository } from "../infrastructure/blog.repository";
import { ResultCode } from "../../../enum/result-code.enum";
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";
export class BlogDeleteCommand {
  constructor(public blogId: string, public userId: string) {
  }
}

@CommandHandler(BlogDeleteCommand)
export class BlogDeleteUseCase implements ICommandHandler<BlogDeleteCommand> {
  constructor(private readonly blogRepository: IBlogRepository) {
  }
  async execute(command:BlogDeleteCommand) {
    const blog = await this.blogRepository.getBlogById(command.blogId)
    if(!blog) return ResultCode.NotFound
    if(blog.ownerId !== command.userId) return ResultCode.Forbidden
    try {
      await this.blogRepository.delete(command.blogId)
      return ResultCode.Success
    } catch (e) {
      console.log('blog delete use case:' + e);
      return null
    }
  }
}