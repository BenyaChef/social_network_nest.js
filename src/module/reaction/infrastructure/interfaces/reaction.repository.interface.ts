import { ReactionDbModel } from "../../model/reaction.db.model";

export abstract class IReactionRepository {

  abstract updateReactionByParentId(newReaction: ReactionDbModel)

  abstract updateBanStatus(userId: string, banStatus: boolean)
}