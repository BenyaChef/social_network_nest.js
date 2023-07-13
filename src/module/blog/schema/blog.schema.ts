import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';
import {UpdateBlogDto} from "../dto/update.blog.dto";
import {CreateBlogDto} from "../dto/create.blog.dto";


@Schema()
export class Blog {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    websiteUrl: string;

    @Prop({default: () => new Date().toISOString()})
    createdAt: string;

    @Prop({default: false})
    isMembership: boolean;

    update(updateDto: UpdateBlogDto) {
        this.name = updateDto.name
        this.description = updateDto.description
        this.websiteUrl = updateDto.websiteUrl
    }

    static createBlog(blogModel: BlogsModel, createDto: CreateBlogDto): BlogDocument {
        return new blogModel(createDto)
    }
}

interface BlogStatic {
    createBlog(blogModel: BlogsModel, createDto: CreateBlogDto): BlogDocument
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods.update = Blog.prototype.update
BlogSchema.statics.createBlog = Blog.createBlog


export type BlogDocument = HydratedDocument<Blog>;
export type BlogsModel = Model<BlogDocument> & BlogStatic

