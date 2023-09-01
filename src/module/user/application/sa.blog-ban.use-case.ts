import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IBlogRepository } from "../../blog/infrastructure/interfaces/blog-repository.interface";


export class SaBlogBanCommand {
  constructor(public blogId: string, public banDto: boolean) {
  }
}

@CommandHandler(SaBlogBanCommand)
export class SaBlogBanUseCase implements ICommandHandler<SaBlogBanCommand> {
  constructor(private readonly blogRepository: IBlogRepository) {}
 async execute(command: SaBlogBanCommand): Promise<boolean> {
    return await this.blogRepository.banUnbanBlog(command.banDto, command.blogId)
 }
}