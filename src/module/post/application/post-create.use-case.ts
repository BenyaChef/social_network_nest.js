import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateDto } from '../dto/create.post.dto';
import { Post } from '../schema/post.schema';
import { Blog, BlogDocument } from "../../blog/schema/blog.schema";
import { ResultCode } from '../../../enum/result-code.enum';
import { IPostRepository } from '../infrastructure/interfaces/post.repository.interface';
import { IBlogRepository } from '../../blog/infrastructure/interfaces/blog-repository.interface';
import { randomUUID } from 'crypto';
import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';
import { UpdatePostDto } from "../dto/update.post.dto";

export class PostCreateCommand {
  constructor(
    public blogId: string,
    public createDto: PostCreateDto,
  ) {}
}

@CommandHandler(PostCreateCommand)
export class PostCreateUseCase implements ICommandHandler<PostCreateCommand> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly blogRepository: IBlogRepository,
  ) {}

  async execute(command: PostCreateCommand): Promise<ResultCode | string> {
    const blog: Blog | null = await this.blogRepository.getBlogById(
      command.blogId,
    );
    if (!blog) return ResultCode.NotFound;

    const newPost: Post = {
      id: randomUUID(),
      blogName: blog.name,
      blogId: blog.id,
      title: command.createDto.title,
      content: command.createDto.content,
      shortDescription: command.createDto.shortDescription,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ReactionStatusEnum.None,
        newestLikes: [],
      }
    };
    await this.postRepository.createPost(newPost);
    return newPost.id;
  }
}
