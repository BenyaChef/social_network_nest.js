import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogRepository } from "../../blog/infrastructure/blog.repository";


export class SaBlogBanCommand {
  constructor(public blogId: string, public banDto: boolean) {
  }
}

@CommandHandler(SaBlogBanCommand)
export class SaBlogBanUseCase implements ICommandHandler<SaBlogBanCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}
 async execute(command: SaBlogBanCommand): Promise<any> {
    return await this.blogRepository.banUnbanBlog(command.banDto, command.blogId)
 }
}