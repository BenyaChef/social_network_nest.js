import { Injectable } from '@nestjs/common';
import { IPostRepository } from '../interfaces/post.repository.interface';
import { UpdatePostDto } from '../../dto/update.post.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { ReactionsPosts } from "../../../reaction/entities/reactions-posts.entity";

@Injectable()
export class PostTypeormRepository implements IPostRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  createPost(newPost: PostEntity) {
    return this.postRepository.save(newPost);
  }

  async deletePost(postId: string): Promise<boolean> {
    const deleteResult = await this.postRepository.delete({id: postId})
    if(!deleteResult.affected) return false
    return deleteResult.affected > 0
  }

  getPostById(postId: string): Promise<PostEntity | null> {
    return this.postRepository.findOneBy({ id: postId });
  }

  async update(updateDto: UpdatePostDto, postId: string) {
    const updateResult = await this.postRepository.update(postId, {
      content: updateDto.content,
      shortDescription: updateDto.shortDescription,
      title: updateDto.title,
    });
    if (!updateResult.affected) return null;
    return updateResult.affected > 0;
  }

  getPostReactions(userId: string, postId: string): Promise<ReactionsPosts | null> {
    return this.dataSource.manager.findOneBy(ReactionsPosts, {userId: userId, parentId: postId})
  }
}
