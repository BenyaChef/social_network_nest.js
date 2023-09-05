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

  async banUnbanBlog(banDto: boolean, blogId: string): Promise<boolean> {

    const banDate = new Date().toISOString()
    return this.dataSource.query(
      `
      UPDATE public."Blogs"
            SET "IsBanned" = $1, "BanDate" = CASE WHEN $1 = true THEN $2 ELSE null END
            WHERE "Id" = $3`,
      [banDto, banDate, blogId],
    );
  }

  async banUnbanUser(banInfo: BlogBanUsers) {
    const findBanUser = await this.dataSource.query(
      `
    SELECT *
    FROM public."UsersBanList"
    WHERE "UserId" = $1 AND "BlogId" = $2
    `,
      [banInfo.userId, banInfo.blogId],
    );
    if (findBanUser.length === 0) {
      return this.dataSource.query(
        `
     INSERT INTO public."UsersBanList"(
        "Id", "UserId", "Login", "BlogId", "BanReason", "IsBanned", "CreatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7);
     `,
        [
          banInfo.id,
          banInfo.userId,
          banInfo.login,
          banInfo.blogId,
          banInfo.banReason,
          banInfo.isBanned,
          banInfo.banData,
        ],
      );
    }
    return this.dataSource.query(
      `
    UPDATE public."UsersBanList"
     SET "BanReason"= $1, "IsBanned"= $2, "BanData"= $3
     WHERE "UserId" = $4 AND "BlogId" = $5
    `,
      [
        banInfo.banReason,
        banInfo.isBanned,
        banInfo.banData,
        banInfo.userId,
        banInfo.blogId,
      ],
    );
  }

  async bindOwnerId(blogId: string, userId: string) {
    return this.dataSource.query(`
    UPDATE public."Blogs"
        SET "OwnerId" = $1
        WHERE "Id" = $2`,
      [userId, blogId]
    );
  }

  async create(newBlog: Blog) {
    return this.dataSource.query(
      `
    INSERT INTO public."Blogs"(
    "Id", "Name", "Description", "WebsiteUrl", "CreatedAt", "IsMembership")
VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        newBlog.id,
        newBlog.name,
        newBlog.description,
        newBlog.websiteUrl,
        newBlog.createdAt,
        newBlog.isMembership,

      ],
    );
  }

  async delete(blogId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.query(
      `
    DELETE FROM public."Blogs"
        WHERE "Id" = $1;
    `,
      [blogId],
    );
    return deleteResult[1] > 0;
  }

  async getBlogById(blogId: string): Promise<Blog | null> {
    const blog = await this.dataSource.query(
      `
    SELECT *
    FROM public."Blogs"
    WHERE "Id" = $1`,
      [blogId],
    );
    if (blog.length === 0) return null;
    return {
      id: blog[0].Id,
      name: blog[0].Name,
      description: blog[0].Description,
      websiteUrl: blog[0].WebsiteUrl,
      createdAt: blog[0].CreatedAt,
      isMembership: blog[0].IsMembership,
    };
  }

  async update(updateDto: UpdateBlogDto, blogId: string) {
    return this.dataSource.query(
      `
    UPDATE public."Blogs"
      SET "Name" = $1, 
          "Description" = $2, 
          "WebsiteUrl" = $3
      WHERE "Id" = $4;
    `,
      [updateDto.name, updateDto.description, updateDto.websiteUrl, blogId],
    );
  }
}
