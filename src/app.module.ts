import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseConfig } from './config/mongoose.config';
import { Blog, BlogSchema } from './module/blog/schema/blog.schema';
import { BlogController } from './module/blog/api/blog.controller';
import { BlogService } from './module/blog/application/blog.service';
import { BlogRepository } from './module/blog/infrastructure/blog.repository';
import { BlogQueryRepository } from './module/blog/infrastructure/blog.query.repository';
import { Post, PostSchema } from './module/post/schema/post.schema';
import { PostController } from './module/post/api/post.controller';
import { PostService } from './module/post/application/post.service';
import { PostQueryRepository } from './module/post/infrastructure/post.query.repository';
import { PostRepository } from './module/post/infrastructure/post.repository';
import { TestingService } from './module/testing/application/testing.service';
import { TestingRepository } from './module/testing/infrastructure/testing.repository';
import { TestingController } from './module/testing/api/testing.controller';

const controllers = [
  AppController,
  BlogController,
  PostController,
  TestingController,
];

const services = [
  AppService,
  BlogService,
  PostService,
  BlogRepository,
  BlogQueryRepository,
  PostQueryRepository,
  PostRepository,
  TestingService,
  TestingRepository,
];

const mongooseModule = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({imports: [ConfigModule], useClass: MongooseConfig }),
    MongooseModule.forFeature(mongooseModule),
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
