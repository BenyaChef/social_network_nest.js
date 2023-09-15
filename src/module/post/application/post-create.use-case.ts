import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateDto } from '../dto/create.post.dto';
import { IPostRepository } from '../infrastructure/interfaces/post.repository.interface';
import { IBlogRepository } from '../../blog/infrastructure/interfaces/blog-repository.interface';
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

  async execute(command: PostCreateCommand): Promise<null | string> {
    const blog: BlogEntity | null = await this.blogRepository.getBlogById(
      command.blogId,
    );
    if (!blog) return null

    const newPost: PostEntity = new PostEntity()
    newPost.blogId = blog.id
    newPost.title = command.createDto.title
    newPost.content = command.createDto.content
    newPost.shortDescription = command.createDto.shortDescription
    const post: PostEntity = await this.postRepository.createPost(newPost);
    return post.id
  }
}
