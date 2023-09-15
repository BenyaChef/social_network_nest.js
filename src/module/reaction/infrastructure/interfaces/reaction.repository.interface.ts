import { ReactionDbModel } from "../../model/reaction.db.model";
import { ReactionsComments } from "../../entities/reactions.entity";
;

export abstract class IReactionRepository {

  abstract updateReactionByCommentId(newReaction: ReactionsComments)

  abstract updateReactionByPostId(newReaction: ReactionDbModel)

  abstract updateBanStatus(userId: string, banStatus: boolean)
}