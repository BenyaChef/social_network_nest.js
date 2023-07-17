import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';
import {UpdatePostDto} from "../dto/update.post.dto";
import {BlogDocument} from "../../blog/schema/blog.schema";
import {CreatePostDto} from "../dto/create.post.dto";

@Schema()
export class Post {
    @Prop()
    title: string;

    @Prop()
    shortDescription: string;

    @Prop()
    content: string;

    @Prop()
    blogId: string;

    @Prop()
    blogName: string;

    @Prop({default: () => new Date().toISOString()})
    createdAt: string;

    update(updateDto: UpdatePostDto, blog: BlogDocument) {
        this.title = updateDto.title
        this.shortDescription = updateDto.shortDescription
        this.content = updateDto.content
        this.blogId = blog.id
        this.blogName = blog.name
    }

    static createPost(createDto: CreatePostDto, blogInfo: BlogDocument): Post {
        const newPost = new Post()
        newPost.blogName = blogInfo.name
        newPost.blogId = blogInfo.id
        newPost.title = createDto.title
        newPost.content = createDto.content
        newPost.shortDescription = createDto.shortDescription
        newPost.createdAt = new Date().toISOString()
        return newPost
    }

}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.methods.update = Post.prototype.update
PostSchema.statics.createPost = Post.createPost

export type PostDocument = HydratedDocument<Post>;
