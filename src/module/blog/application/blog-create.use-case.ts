import { CreateBlogDto } from "../dto/create.blog.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Blog } from "../schema/blog.schema";
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { randomUUID } from "crypto";


export class BlogCreateCommand {
  constructor(public createBlgDto: CreateBlogDto) {
  }
}

@CommandHandler(BlogCreateCommand)
export class BlogCreateUseCase implements ICommandHandler<BlogCreateCommand> {
  constructor(private readonly blogRepository: IBlogRepository) {
  }

  async execute(command: BlogCreateCommand): Promise<string | null> {
    const newBlog: Blog = {
      id: randomUUID(),
      name: command.createBlgDto.name,
      description: command.createBlgDto.description,
      websiteUrl: command.createBlgDto.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    }
    try {
      await this.blogRepository.create(newBlog)
      return newBlog.id
    } catch (e) {
      console.log('create blog use case:' + e);
      return null
    }
  }
}