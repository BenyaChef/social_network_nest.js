
import { ReactionsComments } from "../../entities/reactions-comments.entity";
import { ReactionsPosts } from "../../entities/reactions-posts.entity";
;

export abstract class IReactionRepository {

  abstract updateReaction(newReaction: ReactionsComments | ReactionsPosts)

  abstract updateBanStatus(userId: string, banStatus: boolean)

}