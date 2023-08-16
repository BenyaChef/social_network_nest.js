import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { PostRepository } from "../infrastructure/post.repository";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { ReactionService } from "../../reaction/application/reaction.service";
import { ResultCode } from "../../../enum/result-code.enum";

export class PostUpdateReactionCommand {
  constructor(public postId: string, public userId: string, public reactions: ReactionStatusEnum) {
  }
}

@CommandHandler(PostUpdateReactionCommand)
export class PostUpdateReactionUseCase
  implements ICommandHandler<PostUpdateReactionCommand>
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly reactionService: ReactionService,
  ) {}

 async execute(command: PostUpdateReactionCommand): Promise<any> {
   const post = await this.postRepository.getPostById(command.postId)
   if(!post) return ResultCode.NotFound

   const user = await this.userRepository.getUserById(command.userId)
   if(!user) return ResultCode.NotFound

   const resultUpdateReaction = await this.reactionService.updateReactionByParentId(command.postId, command.reactions, user)
   if(!resultUpdateReaction) return ResultCode.NotFound
   return ResultCode.Success
 }
}