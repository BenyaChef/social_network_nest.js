import { CreatePostDto } from '../dto/create.post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { Model } from 'mongoose';
import { PostRepository } from '../infrastructure/post.repository';
import { BlogRepository } from "../../blog/infrastructure/blog.repository";

export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository
  ) {}

  async createPost(body: CreatePostDto) {
    const findBlog = await this.blogRepository.getBlogById(body.blogId)
    if(!findBlog) return null
    const newPost = new this.postModel(body);
    newPost.blogName = findBlog.name
    return this.postRepository.save(newPost)
  }
}
