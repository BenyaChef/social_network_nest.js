import { CreateBlogDto } from "../dto/create.blog.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";
import { BlogEntity } from "../entities/blog.entity";


export class BlogCreateCommand {
  constructor(public createBlgDto: CreateBlogDto) {
  }
}

@CommandHandler(BlogCreateCommand)
export class BlogCreateUseCase implements ICommandHandler<BlogCreateCommand> {
  constructor(private readonly blogRepository: IBlogRepository) {
  }

  async execute(command: BlogCreateCommand): Promise<string | null> {
    const newBlog = new BlogEntity()
    newBlog.name = command.createBlgDto.name
    newBlog.description = command.createBlgDto.description
    newBlog.websiteUrl = command.createBlgDto.websiteUrl
    newBlog.isMembership = false

    try {
      await this.blogRepository.create(newBlog)
      return newBlog.id
    } catch (e) {
      console.log('create blog use case:' + e);
      return null
    }
  }
}