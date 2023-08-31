import { Injectable } from '@nestjs/common';
import { IBlogRepository } from '../interfaces/blog-repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogBanUsers } from '../../schema/blog.ban-users.schema';
import { Blog } from '../../schema/blog.schema';
import { UpdateBlogDto } from '../../dto/update.blog.dto';

@Injectable()
export class SqlBlogRepository implements IBlogRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  banUnbanBlog(banDto: boolean, blogId: string) {}

  banUnbanUser(banInfo: BlogBanUsers) {}

  bindOwnerId(blogId: string, userId: string) {}

  async create(newBlog: Blog) {
    return this.dataSource.query(
      `
    INSERT INTO public."Blogs"(
    "Id", "Name", "Description", "WebsiteUrl", "CreatedAt", "IsMembership", "OwnerId", "IsBanned", "BanDate")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        newBlog.id,
        newBlog.name,
        newBlog.description,
        newBlog.websiteUrl,
        newBlog.createdAt,
        newBlog.isMembership,
        newBlog.ownerId,
        newBlog.isBanned,
        newBlog.banDate,
      ],
    );
  }

  async delete(blogId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.query(`
    DELETE FROM public."Blogs"
        WHERE "Id" = $1;
    `, [blogId])
    console.log(deleteResult);
      return deleteResult[1] > 0
  }

  async getBlogById(blogId: string): Promise<Blog | null> {
    const blog = await this.dataSource.query(
      `
    SELECT *
    FROM public."Blogs"
    WHERE "Id" = $1`,
      [blogId],
    );
    if(blog.length === 0) return null
    return {
      id: blog[0].Id,
      name: blog[0].Name,
      description: blog[0].Description,
      websiteUrl: blog[0].WebsiteUrl,
      createdAt: blog[0].CreatedAt,
      isMembership: blog[0].IsMembership,
      ownerId: blog[0].OwnerId,
      ownerLogin: blog[0].OwnerLogin,
      isBanned: blog[0].IsBanned,
      banDate: blog[0].BanDate,
      bannedUsers: blog[0].BannedUsers,
    };
  }

  async update(updateDto: UpdateBlogDto, blogId: string) {
    return this.dataSource.query(`
    UPDATE public."Blogs"
      SET "Name" = $1, 
          "Description" = $2, 
          "WebsiteUrl" = $3
      WHERE "Id" = $4;
    `,
      [
        updateDto.name,
        updateDto.description,
        updateDto.websiteUrl,
        blogId
      ],
    );
  }
}
