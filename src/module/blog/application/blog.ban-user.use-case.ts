import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogBanDto } from '../dto/blog.ban.dto';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { BlogBanUsers } from '../schema/blog.ban-users.schema';
import { BlogRepository } from '../infrastructure/blog.repository';
import { ResultCode } from '../../../enum/result-code.enum';

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
    private readonly userRepository: UserRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: BlogBanUnbanUserCommand): Promise<ResultCode> {
    const user = await this.userRepository.getUserById(command.userId);
    if (!user) return ResultCode.NotFound;

    const blog = await this.blogRepository.getBlogById(command.banDto.blogId);
    if (!blog) return ResultCode.NotFound;
    if (blog.ownerId !== command.ownerId) return ResultCode.Forbidden;

    const banUserInfo = BlogBanUsers.createBanInfoUser(command.banDto, user);

    await this.blogRepository.banUnbanUser(banUserInfo);
    return ResultCode.Success;
  }
}
