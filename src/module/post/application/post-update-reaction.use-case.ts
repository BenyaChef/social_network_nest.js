import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { ReactionService } from "../../reaction/application/reaction.service";
import { ResultCode } from "../../../enum/result-code.enum";
import { IPostRepository } from "../infrastructure/interfaces/post.repository.interface";
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { ReactionsPosts } from "../../reaction/entities/reactions-posts.entity";
import { IReactionRepository } from "../../reaction/infrastructure/interfaces/reaction.repository.interface";

export class PostUpdateReactionCommand {
  constructor(public postId: string, public userId: string, public reaction: ReactionStatusEnum) {
  }
}

@CommandHandler(PostUpdateReactionCommand)
export class PostUpdateReactionUseCase
  implements ICommandHandler<PostUpdateReactionCommand>
{
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository,
    private readonly reactionRepository: IReactionRepository,
  ) {}

 async execute(command: PostUpdateReactionCommand): Promise<any> {
   const post = await this.postRepository.getPostById(command.postId)
   if(!post) return ResultCode.NotFound

   const user = await this.userRepository.getUserById(command.userId)
   if(!user) return ResultCode.NotFound

   const reactions: ReactionsPosts | null = await this.postRepository.getPostReactions(command.userId, command.postId)

   let newReaction
   if(!reactions) {
     newReaction = new ReactionsPosts();
   } else {
     newReaction = reactions
   }
   newReaction.userId = command.userId;
   newReaction.parentId = command.postId;
   newReaction.reactionStatus = command.reaction;

   await this.reactionRepository.updateReaction(newReaction);

   return ResultCode.Success;
 }
}