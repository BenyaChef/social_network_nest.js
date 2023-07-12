import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;

  @Prop({ default: false })
  isMembership: boolean;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);


