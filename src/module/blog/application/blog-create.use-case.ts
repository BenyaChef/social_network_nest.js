import { CreateBlogDto } from "../dto/create.blog.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Blog } from "../schema/blog.schema";
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { randomUUID } from "crypto";


export class BlogCreateCommand {
  constructor(public createBlgDto: CreateBlogDto, public userId: string) {
  }
}

@CommandHandler(BlogCreateCommand)
export class BlogCreateUseCase implements ICommandHandler<BlogCreateCommand> {
  constructor(private readonly blogRepository: IBlogRepository,
              private readonly userRepository: IUserRepository) {
  }

  async execute(command: BlogCreateCommand): Promise<string | null> {
    const user = await this.userRepository.getUserById(command.userId)
    if(!user) return null

    const newBlog: Blog = {
      id: randomUUID(),
      name: command.createBlgDto.name,
      description: command.createBlgDto.description,
      websiteUrl: command.createBlgDto.websiteUrl,
      ownerId: user.id,
      isMembership: false,
      createdAt: new Date().toISOString(),
      isBanned: false,
      banDate: null,
      ownerLogin: '',
      bannedUsers: [],
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