import { Post } from '../../schema/post.schema';
import { UpdatePostDto } from '../../dto/update.post.dto';

export abstract class IPostRepository {
  abstract getPostById(postId: string): Promise<Post | null>;

  abstract createPost(newPost: Post): Promise<string>;

  abstract deletePost(postId: string): Promise<boolean>;

  abstract update(updateDto: UpdatePostDto, postId: string);
}