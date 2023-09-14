import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateDto } from '../dto/create.post.dto';
import { ResultCode } from '../../../enum/result-code.enum';
import { IPostRepository } from '../infrastructure/interfaces/post.repository.interface';
import { IBlogRepository } from '../../blog/infrastructure/interfaces/blog-repository.interface';
import { randomUUID } from 'crypto';
import { PostEntity } from "../entities/post.entity";
import { BlogEntity } from "../../blog/entities/blog.entity";

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
    const blog: BlogEntity | null = await this.blogRepository.getBlogById(
      command.blogId,
    );
    if (!blog) return ResultCode.NotFound;

    const newPost: PostEntity = {
      id: randomUUID(),
      blog: blog,
      blogName: blog.name,
      title: command.createDto.title,
      content: command.createDto.content,
      shortDescription: command.createDto.shortDescription,
      createdAt: new Date().toISOString(),

    };
    await this.postRepository.createPost(newPost);
    return newPost.id;
  }
}
