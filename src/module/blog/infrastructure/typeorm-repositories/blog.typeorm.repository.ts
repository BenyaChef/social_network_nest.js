import { Injectable } from '@nestjs/common';
import { IBlogRepository } from '../interfaces/blog-repository.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogBanUsers } from '../../schema/blog.ban-users.schema';
import { Blog } from '../../schema/blog.schema';
import { UpdateBlogDto } from '../../dto/update.blog.dto';
import { BlogEntity } from '../../entities/blog.entity';

@Injectable()
export class BlogTypeormRepository implements IBlogRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
  ) {}

  banUnbanBlog(banDto: boolean, blogId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  banUnbanUser(banInfo: BlogBanUsers) {}

  bindOwnerId(blogId: string, userId: string) {}

  async create(newBlog: Blog) {
    return this.blogRepository.save(newBlog);
  }

  async delete(blogId: string): Promise<boolean> {
    const deleteResult = await this.blogRepository.delete({ id: blogId });
    if (!deleteResult.affected) return false;
    return deleteResult.affected > 0;
  }

  getBlogById(blogId: string): Promise<Blog | null> {
    return this.blogRepository.findOneBy({ id: blogId });
  }

  update(updateDto: UpdateBlogDto, blogId: string) {}
}