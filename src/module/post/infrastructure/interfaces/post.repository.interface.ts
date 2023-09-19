import { UpdatePostDto } from '../../dto/update.post.dto';
import { PostEntity } from "../../entities/post.entity";
import { ReactionsPosts } from "../../../reaction/entities/reactions-posts.entity";

export abstract class IPostRepository {
  abstract getPostById(postId: string): Promise<PostEntity | null>;

  abstract createPost(newPost: PostEntity);

  abstract deletePost(postId: string): Promise<boolean>;

  abstract update(updateDto: UpdatePostDto, postId: string);

  abstract getPostReactions(userId: string, postId: string) : Promise<ReactionsPosts | null>
}