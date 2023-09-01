import { Blog } from '../../schema/blog.schema';
import { UpdateBlogDto } from '../../dto/update.blog.dto';
import { BlogBanUsers } from '../../schema/blog.ban-users.schema';

export abstract class IBlogRepository {
  abstract getBlogById(blogId: string): Promise<Blog| null>
  abstract create(newBlog: Blog)
  abstract update(updateDto: UpdateBlogDto, blogId: string)
  abstract banUnbanBlog(banDto: boolean, blogId: string): Promise<boolean>
  abstract delete(blogId: string): Promise<boolean>
  abstract bindOwnerId(blogId: string, userId: string)
  abstract banUnbanUser(banInfo: BlogBanUsers)
}