import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BlogController } from './module/blog/api/blog.controller';
import { PostController } from './module/post/api/post.controller';
import { TestingService } from './module/testing/application/testing.service';
import { TestingController } from './module/testing/api/testing.controller';
import { UserController } from './module/user/api/user.controller';
import { UserService } from './module/user/application/user.service';
import { BlogExistsValidation } from './validators/blog.exists.validator';
import { TrimValidator } from './validators/trim.validator';
import { AuthController } from './module/auth/api/auth.controller';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SessionService } from './module/sessions/application/session.service';
import { MailModule } from './module/email/mail.module';
import { MailAdapter } from './module/email/mail.adapter';
import { LoginExistsValidation } from './validators/login.exists.validator';
import { EmailExistsValidation } from './validators/email.exists.validator';
import { CommentController } from './module/comment/api/comment.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './module/auth/application/jwt.service';
import { LocalStrategy } from './strategy/auth-local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategy/auth.access.jwt.strategy';
import { JwtRefreshStrategy } from './strategy/auth.refresh.jwt.strategy';
import { ReactionService } from './module/reaction/application/reaction.service';
import { SecurityController } from './module/security/api/security.controller';
import { APP_GUARD } from '@nestjs/core';
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
import { BlogBanUserUseCase } from "./module/blog/application/blog.ban-user.use-case";
import { CommentCreateUseCase } from "./module/comment/application/comment-create.use-case";
import { SaBlogBanUseCase } from "./module/user/application/sa.blog-ban.use-case";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ITestingRepository } from "./module/testing/infrastructure/interfaces/interface.testing-repository";
import { SqlTestingRepository } from "./module/testing/infrastructure/sql.testing.repository";
import { IUserRepository } from "./module/user/infrastructure/interfaces/user-repository.interface";
import { RegistrationUserUseCase } from "./module/auth/application/use-cases/registration-user.use-case";
import { IUserQueryRepository } from "./module/user/infrastructure/interfaces/user.query-repository.interface";
import { LoginUserUseCase } from "./module/auth/application/use-cases/login-user.use-case";
import { ISessionRepository } from "./module/sessions/infrastructure/interfaces/session.repository.interface";
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
import { TokensUpdateUseCase } from "./module/auth/application/use-cases/tokens-update.use-case";
import {
  DeleteAllSessionsExceptCurrentUserUseCase
} from "./module/sessions/application/use-cases/delete.all-sessions.except-current-user.use-case";
import {
  DeleteSessionByDeviceIdUseCase
} from "./module/sessions/application/use-cases/delete.session-by-deviceId.use-case";
import { IBlogQueryRepository } from "./module/blog/infrastructure/interfaces/blog.query-repository.interface";
import { IBlogRepository } from "./module/blog/infrastructure/interfaces/blog-repository.interface";
import { IPostRepository } from "./module/post/infrastructure/interfaces/post.repository.interface";
import { IPostQueryRepository } from "./module/post/infrastructure/interfaces/post.query-repository.interface";
import { ICommentQueryRepository } from "./module/comment/infrastructure/interfaces/comment.query-repository.interface";
import { ICommentRepository } from "./module/comment/infrastructure/interfaces/comment.repository.interface";
import { IReactionRepository } from "./module/reaction/infrastructure/interfaces/reaction.repository.interface";
import { CommentUpdateReactionUseCase } from "./module/comment/application/comment.update-reaction.use-case";
import { CommentUpdateUseCase } from "./module/comment/application/comment.update.use-case";
import { CommentDeleteUseCase } from "./module/comment/application/comment.delete.use-case";
import { UserEntity } from "./module/user/entities/user.entity";
import { UserTypeormRepository } from "./module/user/infrastructure/typeorm-repository/user.typeorm.repository";
import {
  UserTypeormQueryRepository
} from "./module/user/infrastructure/typeorm-repository/user.typeorm.query-repository";
import { PasswordRecoveryInfo } from "./module/user/entities/user.password-recovery.entity";
import { EmailConfirmationInfo } from "./module/user/entities/user.email-confirmation.entity";
import {
  SessionTypeormRepository
} from "./module/sessions/infrastructure/typeorm-repositoryes/session.typeorm.repository";
import { SessionUser } from "./module/sessions/entities/session.entity";
import {
  SessionTypeormQueryRepository
} from "./module/sessions/infrastructure/typeorm-repositoryes/session.typeorm.query.repository";
import { BlogEntity } from "./module/blog/entities/blog.entity";
import { BlogTypeormRepository } from "./module/blog/infrastructure/typeorm-repositories/blog.typeorm.repository";
import {
  BlogTypeormQueryRepository
} from "./module/blog/infrastructure/typeorm-repositories/blog.typeorm.query.repository";
import { PostTypeormRepository } from "./module/post/infrastructure/typeorm-repository/post.typeorm.repository";
import {
  PostTypeormQueryRepository
} from "./module/post/infrastructure/typeorm-repository/post.typeorm.query.repository";
import { PostEntity } from "./module/post/entities/post.entity";
import {
  CommentTypeormQueryRepository
} from "./module/comment/infrastructure/typeorm-repository/comment.typeorm.query.repository";
import {
  CommentTypeormRepository
} from "./module/comment/infrastructure/typeorm-repository/comment.typeorm.repository";
import {
  ReactionsTypeormRepository
} from "./module/reaction/infrastructure/typeorm-repository/reactions.typeorm.repository";
import { CommentEntity } from "./module/comment/entities/comment.entity";
import { ReactionsComments } from "./module/reaction/entities/reactions-comments.entity";
import { ReactionsPosts } from "./module/reaction/entities/reactions-posts.entity";
import { QuizController } from "./module/quiz/api/quiz.controller";
import { QuestionEntity } from "./module/quiz/entities/question.entity";
import { IQuizRepository } from "./module/quiz/infrastructure/interface/quiz.repository.interface";
import { QuizRepository } from "./module/quiz/infrastructure/typeorm-repository/quiz.repository";
import { QuestionCreateUseCase } from "./module/quiz/application/question-create.use-case";
import { IQuizQueryRepository } from "./module/quiz/infrastructure/interface/quiz.query-repository.interface";
import { QuizQueryRepository } from "./module/quiz/infrastructure/typeorm-repository/quiz.query.repository";
import { QuestionUpdateUseCase } from "./module/quiz/application/question-update.use-case";
import {
  QuestionUpdatePublishedStatusUseCase
} from "./module/quiz/application/question-update.published-status.use-case";
import { QuestionDeleteUseCase } from "./module/quiz/application/question-delete.use-case";
import * as process from "process";
import { AnswerEntity } from "./module/quiz/entities/answer.entity";

const controllers = [
  AppController,
  BlogController,
  PostController,
  UserController,
  TestingController,
  AuthController,
  CommentController,
  SecurityController,
  QuizController
];

const options: TypeOrmModuleOptions  = {
  type: 'postgres',
  url: process.env.POSTGRESQL_URI || 'postgres://BenyaChef:uz9LBTdVMDW5@ep-lucky-sun-90762571.eu-central-1.aws.neon.tech/neondb',
  // host: process.env.POSTGRESQL_HOST,
  // port: 5432,
  // username: process.env.POSTGRESQL_NAME || 'postgres',
  // password: process.env.POSTGRESQL_PASS || 'sa',
  // database: process.env.POSTGRESQL_DB || 'social_network',
  autoLoadEntities: true,
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
      sslmode: "require"
    }
  }
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
  DeleteSessionByDeviceIdUseCase,
  CommentUpdateReactionUseCase,
  CommentUpdateUseCase,
  CommentDeleteUseCase,
  QuestionCreateUseCase,
  QuestionUpdateUseCase,
  QuestionUpdatePublishedStatusUseCase,
  QuestionDeleteUseCase

];

const strategy = [LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy];

const services = [
  ReactionService,
  TokenService,
  JwtService,
  AppService,
  UserService,
  TestingService,
  SessionService,
];

const repositories = [
  { provide: ITestingRepository, useClass: SqlTestingRepository },
  { provide: IUserQueryRepository, useClass: UserTypeormQueryRepository },
  { provide: IUserRepository, useClass: UserTypeormRepository},
  { provide: ISessionRepository, useClass: SessionTypeormRepository },
  { provide: ISessionQueryRepository, useClass: SessionTypeormQueryRepository },
  { provide: IBlogQueryRepository, useClass: BlogTypeormQueryRepository},
  { provide: IBlogRepository, useClass: BlogTypeormRepository},
  { provide: IPostRepository, useClass: PostTypeormRepository},
  { provide: IPostQueryRepository, useClass: PostTypeormQueryRepository},
  { provide: ICommentQueryRepository, useClass: CommentTypeormQueryRepository},
  { provide: ICommentRepository, useClass: CommentTypeormRepository},
  { provide: IReactionRepository, useClass: ReactionsTypeormRepository},
  { provide: IQuizRepository, useClass: QuizRepository},
  { provide: IQuizQueryRepository, useClass: QuizQueryRepository}
]

const guard = [{ provide: APP_GUARD, useClass: ThrottlerGuard }];
const entities = [
  UserEntity, PasswordRecoveryInfo, EmailConfirmationInfo,
  SessionUser, BlogEntity, PostEntity,
  CommentEntity, ReactionsComments, ReactionsPosts, QuestionEntity, AnswerEntity]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    PassportModule,
    MailModule,
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature(entities),
    // ThrottlerModule.forRoot(),
  ],
  controllers: controllers,
  providers: [...services, ...validators, ...strategy, ...repositories, ...useCase, MailAdapter],
})
export class AppModule {}
