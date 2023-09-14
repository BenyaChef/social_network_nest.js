import { UpdatePostDto } from '../../dto/update.post.dto';
import { PostEntity } from "../../entities/post.entity";

export abstract class IPostRepository {
  abstract getPostById(postId: string): Promise<PostEntity | null>;

  abstract createPost(newPost: PostEntity);

  abstract deletePost(postId: string): Promise<boolean>;

  abstract update(updateDto: UpdatePostDto, postId: string);
}