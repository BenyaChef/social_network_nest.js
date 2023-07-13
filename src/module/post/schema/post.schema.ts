import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';



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

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = HydratedDocument<Post>;