import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../blog/schema/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../post/schema/post.schema';

export class TestingRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async deleteAllData() {
    return Promise.all([
      await this.blogModel.deleteMany({}),
      await this.postModel.deleteMany({}),
    ]).catch((error) => {
      console.log(error);
      return null;
    });
  }
}
