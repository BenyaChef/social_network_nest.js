import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {UpdatePostDto} from "../dto/update.post.dto";
import {BlogDocument} from "../../blog/schema/blog.schema";


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

}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods.update = Post.prototype.update
export type PostDocument = HydratedDocument<Post>;