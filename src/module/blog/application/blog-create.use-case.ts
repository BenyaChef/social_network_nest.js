import { CreateBlogDto } from "../dto/create.blog.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogRepository } from "../infrastructure/blog.repository";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { Blog } from "../schema/blog.schema";

export class BlogCreateCommand {
  constructor(public CreateBlgDto: CreateBlogDto, public userId: string) {
  }
}

@CommandHandler(BlogCreateCommand)
export class BlogCreateUseCase implements ICommandHandler<BlogCreateCommand> {
  constructor(private readonly blogRepository: BlogRepository,
              private readonly userRepository: UserRepository) {
  }

  async execute(command: BlogCreateCommand): Promise<string | null> {
    const user = await this.userRepository.getUserById(command.userId)
    if(!user) return null

    const newBlog: Blog = Blog.createBlog(command.CreateBlgDto, command.userId)
    try {
      await this.blogRepository.create(newBlog)
      return newBlog.id
    } catch (e) {
      console.log('create blog use case:' + e);
      return null
    }
  }
}