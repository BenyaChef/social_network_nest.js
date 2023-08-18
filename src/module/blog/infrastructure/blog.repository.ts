import {Injectable} from '@nestjs/common';
import {Blog, BlogDocument} from '../schema/blog.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { UpdateBlogDto } from "../dto/update.blog.dto";
import { BlogBanUsers, BlogBanUsersDocument } from "../schema/blog.ban-users.schema";


@Injectable()
export class BlogRepository {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
                @InjectModel(BlogBanUsers.name) private blogBanUserModel: Model<BlogBanUsersDocument>) {
    }

    async getBlogById(blogId: string): Promise<BlogDocument | null> {
        return this.blogModel.findOne({ id: blogId });
    }
    
    async create(newBlog: Blog) {
        const blog = await this.blogModel.create(newBlog);
        return blog.id
    }

    async update(updateDto: UpdateBlogDto, blogId: string) {
        return this.blogModel.findOneAndUpdate({id: blogId}, {$set: updateDto})
    }

    // async save(newBlog: BlogDocument): Promise<string> {
    //     const result: BlogDocument = await newBlog.save();
    //     return result.id;
    // }

    async delete(blogId: string): Promise<boolean> {
        const resultDelete = await this.blogModel.deleteOne({ id: blogId })
        return resultDelete.deletedCount === 1
    }

    async bindOwnerId(blogId: string, userId:string) {
        return this.blogModel.findOneAndUpdate({id: blogId}, {$set: {ownerId: userId}})
    }

    async createBanInfoUser(banInfo: BlogBanUsers) {
        return this.blogBanUserModel.create(banInfo)
    }
}
