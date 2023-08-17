import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../infrastructure/user.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { ResultCode } from '../../../enum/result-code.enum';

export class UserBindCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(UserBindCommand)
export class UserBindUseCase implements ICommandHandler<UserBindCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

 async execute(command: UserBindCommand): Promise<ResultCode> {
    const blog = await this.blogRepository.getBlogById(command.blogId)
   if(!blog) return ResultCode.NotFound
   if(blog.ownerId) return ResultCode.BadRequest
   const user = await this.userRepository.getUserById(command.userId)
   if(!user) return ResultCode.NotFound
   await this.blogRepository.bindOwnerId(command.blogId, command.userId)
   return ResultCode.Success
 }
}