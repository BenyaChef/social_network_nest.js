import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastructure/post.query.repository';
import { PostQueryPaginationDto } from "../dto/post.query.pagination.dto";
import { PostViewModel } from "../model/post.view.model";
import { CreatePostDto } from "../dto/create.post.dto";

@Controller('posts')
export class PostController {
  constructor(
    protected postService: PostService,
    protected postQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getAllPosts(query: PostQueryPaginationDto) {
      return this.postQueryRepository.getAllPosts(query)
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string) {
    const post: PostViewModel | null = await this.postQueryRepository.getPostById(postId)
    if(!post) throw new NotFoundException()
    return post
  }

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    const postId = await this.postService.createPost(body)
    return this.postQueryRepository.getPostById(postId)
  }
}