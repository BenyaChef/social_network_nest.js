import { CreatePostDto } from '../dto/create.post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { Model } from 'mongoose';
import { PostRepository } from '../infrastructure/post.repository';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { UpdatePostDto } from "../dto/update.post.dto";

export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
  ) {}

  async createPost(inputCreateDto: CreatePostDto) {
    const findBlog = await this.blogRepository.getBlogById(inputCreateDto.blogId);
    if (!findBlog) return null;
    const newPost = new this.postModel(inputCreateDto);
    newPost.blogName = findBlog.name;
    return this.postRepository.save(newPost);
  }

  async postUpdate(inputUpdateDto: UpdatePostDto, postId: string) {
    const findPost = await this.postRepository.getPostById(postId)
    if(!findPost) return null
    const findBlog = await this.blogRepository.getBlogById(inputUpdateDto.blogId)
    if(!findBlog) return null
    findPost.blogName = findBlog.name
    findPost.blogId = findBlog.id
    findPost.title = inputUpdateDto.title
    findPost.shortDescription = inputUpdateDto.shortDescription
    findPost.content = inputUpdateDto.shortDescription
    return this.postRepository.save(findPost)
  }
}
