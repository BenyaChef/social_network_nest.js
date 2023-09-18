import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogBanDto } from '../dto/blog.ban.dto';
import { ResultCode } from '../../../enum/result-code.enum';
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { IBlogRepository } from "../infrastructure/interfaces/blog-repository.interface";
import { randomUUID } from "crypto";

export class BlogBanUnbanUserCommand {
  constructor(
    public banDto: BlogBanDto,
    public userId: string,
    public ownerId: string,
  ) {}
}

@CommandHandler(BlogBanUnbanUserCommand)
export class BlogBanUserUseCase
  implements ICommandHandler<BlogBanUnbanUserCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly blogRepository: IBlogRepository,
  ) {}

  async execute(command: BlogBanUnbanUserCommand): Promise<ResultCode> {
    const user = await this.userRepository.getUserById(command.userId);
    if (!user) return ResultCode.NotFound;

    const blog = await this.blogRepository.getBlogById(command.banDto.blogId);
    if (!blog) return ResultCode.NotFound;

    const banUserInfo = {
      id: randomUUID(),
      userId: user.id,
      login: user.login,
      blogId: command.banDto.blogId,
      banReason: command.banDto.banReason,
      isBanned: command.banDto.isBanned,
      banData: new Date().toISOString(),
    }

    await this.blogRepository.banUnbanUser(banUserInfo);
    return ResultCode.Success;
  }
}
