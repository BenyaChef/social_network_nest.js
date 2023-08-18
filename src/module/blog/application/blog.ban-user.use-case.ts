import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogBanDto } from "../dto/blog.ban.dto";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { BlogBanUsers } from "../schema/blog.ban-users.schema";
import { BlogRepository } from "../infrastructure/blog.repository";
import { ResultCode } from "../../../enum/result-code.enum";

export class BlogBanUserCommand {
  constructor(public banDto: BlogBanDto, public userId: string, public ownerId: string) {
  }
}

@CommandHandler(BlogBanUserCommand)
export class BlogBanUserUseCase implements ICommandHandler<BlogBanUserCommand> {
  constructor(private readonly userRepository: UserRepository,
              private readonly blogRepository: BlogRepository) {}

  async execute(command: BlogBanUserCommand): Promise<ResultCode> {
    const user = await this.userRepository.getUserById(command.userId)
    if(!user) return ResultCode.NotFound

    const blog = await this.blogRepository.getBlogById(command.banDto.blogId)
    if(!blog) return ResultCode.NotFound
    if(blog.ownerId !== command.ownerId) return ResultCode.Forbidden

    const banUserInfo = BlogBanUsers.createBanInfoUser(command.banDto, user)
    await this.blogRepository.createBanInfoUser(banUserInfo)
    return ResultCode.Success
  }

}
