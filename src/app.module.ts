import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseConfig } from './config/mongoose.config';
import { Blog, BlogSchema } from './module/blog/schema/blog.schema';
import { BlogController } from './module/blog/api/blog.controller';
import { BlogRepository } from './module/blog/infrastructure/blog.repository';
import { BlogQueryRepository } from './module/blog/infrastructure/blog.query.repository';
import { Post, PostSchema } from './module/post/schema/post.schema';
import { PostController } from './module/post/api/post.controller';
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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { CommentService } from './module/comment/application/comment.service';
import { CommentController } from './module/comment/api/comment.controller';
import { CommentRepository } from './module/comment/infrastructure/comment.repository';
import { CommentQueryRepository } from './module/comment/infrastructure/comment.query.repository';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './module/auth/application/jwt.service';
import { LocalStrategy } from './strategy/auth-local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategy/auth.access.jwt.strategy';
import { JwtRefreshStrategy } from './strategy/auth.refresh.jwt.strategy';
import {
  Reaction,
  ReactionSchema,
} from './module/reaction/schema/reaction.schema';
import { ReactionService } from './module/reaction/application/reaction.service';
import { ReactionRepository } from './module/reaction/infrastructure/reaction.repository';
import { SessionQueryRepository } from './module/sessions/infrastructure/session.query.repository';
import { SecurityController } from './module/security/api/security.controller';
import { APP_GUARD } from '@nestjs/core';
import { BloggerController } from './module/blogger/api/blogger.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogCreateUseCase } from './module/blog/application/blog-create.use-case';
import { BlogDeleteUseCase } from './module/blog/application/blog-delete.use-case';
import { BlogUpdateUseCase } from './module/blog/application/blog-update.use-case';
import { PostCreateUseCase } from './module/post/application/post-create.use-case';
import { PostUpdateUseCase } from './module/post/application/post-update.use-case';
import { PostDeleteUseCase } from './module/post/application/post-delete.use-case';
import { PostUpdateReactionUseCase } from './module/post/application/post-update-reaction.use-case';
import { UserCreateUseCase } from './module/user/application/user-create.use-case';
import { UserDeleteUseCase } from './module/user/application/user-delete.use-case';
import { UserBanUseCase } from './module/user/application/user-ban.use-case';
import {
  BlogBanUsers,
  BlogBanUsersSchema,
} from './module/blog/schema/blog.ban-users.schema';
import { BlogBanUserUseCase } from "./module/blog/application/blog.ban-user.use-case";
import { CommentCreateUseCase } from "./module/comment/application/comment-create.use-case";
import { SaBlogBanUseCase } from "./module/user/application/sa.blog-ban.use-case";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserQueryRepositorySql } from "./module/user/infrastructure/raw-sql.repositoryes/user.query-repository.sql";
import { ITestingRepository } from "./module/testing/infrastructure/interfaces/interface.testing-repository";
import { SqlTestingRepository } from "./module/testing/infrastructure/sql.testing.repository";
import { UserRepositorySql } from "./module/user/infrastructure/raw-sql.repositoryes/user.repository.sql";
import { IUserRepository } from "./module/user/infrastructure/interfaces/user-repository.interface";
import { RegistrationUserUseCase } from "./module/auth/application/use-cases/registration-user.use-case";
import { IUserQueryRepository } from "./module/user/infrastructure/interfaces/user.query-repository.interface";
import { LoginUserUseCase } from "./module/auth/application/use-cases/login-user.use-case";
import { ISessionRepository } from "./module/sessions/infrastructure/interfaces/session.repository.interface";
import { SessionRepositorySql } from "./module/sessions/infrastructure/sql-repositoryes/session.repository.sql";
import {
  RegistrationEmailResendingUseCase
} from "./module/auth/application/use-cases/registration-email-resending.use-case";
import {
  RegistrationConfirmationUseCase
} from "./module/auth/application/use-cases/registration-confirmation.use-case";
import { PasswordRecoveryUseCase } from "./module/auth/application/use-cases/password-recovery.use-case";
import { PasswordAssignUseCase } from "./module/auth/application/use-cases/password-assign.use-case";
import { LogoutUseCase } from "./module/sessions/application/use-cases/logout.use-case";
import {
  ISessionQueryRepository
} from "./module/sessions/infrastructure/interfaces/session.query-repository.interface";
import {
  SessionQueryRepositorySql
} from "./module/sessions/infrastructure/sql-repositoryes/session.query.repository.sql";
import { TokensUpdateUseCase } from "./module/auth/application/use-cases/tokens-update.use-case";
import {
  DeleteAllSessionsExceptCurrentUserUseCase
} from "./module/sessions/application/use-cases/delete.all-sessions.except-current-user.use-case";
import {
  DeleteSessionByDeviceIdUseCase
} from "./module/sessions/application/use-cases/delete.session-by-deviceId.use-case";
import { IBlogQueryRepository } from "./module/blog/infrastructure/interfaces/blog.query-repository.interface";
import { SqlBlogQueryRepository } from "./module/blog/infrastructure/sql-repositories/sql.blog-query.repository";
import { IBlogRepository } from "./module/blog/infrastructure/interfaces/blog-repository.interface";
import { SqlBlogRepository } from "./module/blog/infrastructure/sql-repositories/sql.blog.repository";
import { IPostRepository } from "./module/post/infrastructure/interfaces/post.repository.interface";
import { PostSqlRepository } from "./module/post/infrastructure/sql-repositories/post.sql.repository";
import { IPostQueryRepository } from "./module/post/infrastructure/interfaces/post.query-repository.interface";
import { PostSqlQueryRepository} from "./module/post/infrastructure/sql-repositories/post.sql.query.repository";

const controllers = [
  AppController,
  BlogController,
  PostController,
  UserController,
  TestingController,
  AuthController,
  CommentController,
  SecurityController,
  BloggerController,
];

const options: TypeOrmModuleOptions  = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sa',
  database: 'SocialNetwork',
  entities: [],
  synchronize: false,
  ssl: false
}

const validators = [
  BlogExistsValidation,
  TrimValidator,
  LoginExistsValidation,
  EmailExistsValidation,
];

const useCase = [
  BlogCreateUseCase,
  BlogDeleteUseCase,
  BlogUpdateUseCase,
  PostCreateUseCase,
  PostUpdateUseCase,
  PostDeleteUseCase,
  PostUpdateReactionUseCase,
  UserCreateUseCase,
  UserDeleteUseCase,
  UserBanUseCase,
  BlogBanUserUseCase,
  CommentCreateUseCase,
  SaBlogBanUseCase,
  RegistrationUserUseCase,
  LoginUserUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationConfirmationUseCase,
  PasswordRecoveryUseCase,
  PasswordAssignUseCase,
  LogoutUseCase,
  TokensUpdateUseCase,
  DeleteAllSessionsExceptCurrentUserUseCase,
  DeleteSessionByDeviceIdUseCase
];

const strategy = [LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy];

const services = [
  CommentService,
  ReactionService,
  TokenService,
  JwtService,
  AppService,
  UserService,
  BlogRepository,
  BlogQueryRepository,
  PostQueryRepository,
  PostRepository,
  UserQueryRepository,
  UserRepository,
  TestingService,
  SessionService,
  SessionRepository,
  SessionQueryRepository,
  CommentRepository,
  CommentQueryRepository,
  ReactionRepository,
];

const repositories = [
  { provide: ITestingRepository, useClass: SqlTestingRepository },
  { provide: IUserQueryRepository, useClass: UserQueryRepositorySql },
  { provide: IUserRepository, useClass: UserRepositorySql },
  { provide: ISessionRepository, useClass:SessionRepositorySql },
  { provide: ISessionQueryRepository, useClass: SessionQueryRepositorySql },
  { provide: IBlogQueryRepository, useClass: SqlBlogQueryRepository},
  { provide: IBlogRepository, useClass: SqlBlogRepository},
  { provide: IPostRepository, useClass: PostSqlRepository},
  { provide: IPostQueryRepository, useClass: PostSqlQueryRepository},
]

const mongooseModule = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Reaction.name, schema: ReactionSchema },
  { name: BlogBanUsers.name, schema: BlogBanUsersSchema },
];

const guard = [{ provide: APP_GUARD, useClass: ThrottlerGuard }];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature(mongooseModule),
    TypeOrmModule.forRoot(options),
    // ThrottlerModule.forRoot(),
  ],
  controllers: controllers,
  providers: [...services, ...validators, ...strategy, ...repositories, ...useCase, MailAdapter],
})
export class AppModule {}
