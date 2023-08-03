import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
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
import { User, UserSchema } from './module/user/schema/user.schema';
import { UserController } from './module/user/api/user.controller';
import { UserService } from './module/user/application/user.service';
import { UserQueryRepository } from './module/user/infrastructure/user.query.repository';
import { UserRepository } from './module/user/infrastructure/user.repository';
import { BlogExistsValidation } from './validators/blog.exists.validator';
import { TrimValidator } from './validators/trim.validator';
import { AuthController } from './module/auth/api/auth.controller';
import { AuthService } from './module/auth/application/auth.service';
import { JwtService } from './module/auth/application/jwt.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {
  Session,
  SessionSchema,
} from './module/sessions/schema/session.schema';
import { SessionService } from './module/sessions/application/session.service';
import { SessionRepository } from './module/sessions/infrastructure/session.repository';
import { MailModule } from './module/email/mail.module';
import { MailAdapter } from './module/email/mail.adapter';
import { LoginExistsValidation } from './validators/login.exists.validator';
import { EmailExistsValidation } from './validators/email.exists.validator';
import { Comment, CommentSchema } from './module/comment/schema/comment.schema';
import { CommentService } from "./module/comment/application/comment.service";
import { CommentController } from "./module/comment/api/comment.controller";
import { CommentRepository } from "./module/comment/infrastructure/comment.repository";
import { CommentQueryRepository } from "./module/comment/infrastructure/comment.query.repository";
import { BasicAuth } from "./guards/basic.auth.guard";

const controllers = [
  AppController,
  BlogController,
  PostController,
  UserController,
  TestingController,
  AuthController,
  CommentController
];

const validators = [
  BlogExistsValidation,
  TrimValidator,
  LoginExistsValidation,
  EmailExistsValidation,
];

// const guards = [{ provide: APP_GUARD, useClass: ThrottlerGuard }];
// const guards = [{ provide: APP_GUARD, useClass: BasicAuth}]

const services = [
  CommentService,
  AuthService,
  JwtService,
  AppService,
  BlogService,
  PostService,
  UserService,
  BlogRepository,
  BlogQueryRepository,
  PostQueryRepository,
  PostRepository,
  UserQueryRepository,
  UserRepository,
  TestingService,
  TestingRepository,
  SessionService,
  SessionRepository,
  CommentRepository,
  CommentQueryRepository
];

const mongooseModule = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Comment.name, schema: CommentSchema },
];

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature(mongooseModule),
    // ThrottlerModule.forRoot({ ttl: 10, limit: 5 })
  ],
  controllers: controllers,
  providers: [...services, ...validators, MailAdapter],
})
export class AppModule {}
