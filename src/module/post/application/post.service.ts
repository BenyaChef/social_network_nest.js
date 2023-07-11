import { CreatePostDto } from '../dto/create.post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { Model } from 'mongoose';
import { PostRepository } from '../infrastructure/post.repository';

export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected postRepository: PostRepository,
  ) {}

  async createPost(body: CreatePostDto) {
    const newPost = new this.postModel(body);
    return this.postRepository.save(newPost)
  }
}
