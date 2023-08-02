import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../blog/schema/blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../post/schema/post.schema';
import { User, UserDocument } from '../../user/schema/user.schema';
import { Session, SessionDocument } from '../../sessions/schema/session.schema';
import { Comment, CommentDocument } from "../../comment/schema/comment.schema";

export class TestingRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async deleteAllData() {
    return Promise.all([
      await this.blogModel.deleteMany({}),
      await this.postModel.deleteMany({}),
      await this.userModel.deleteMany({}),
      await this.sessionModel.deleteMany({}),
      await this.commentModel.deleteMany({})
    ]).catch((error) => {
      console.log(error);
      return null;
    });
  }
}
