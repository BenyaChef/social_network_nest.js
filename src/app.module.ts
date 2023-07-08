import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/api/blog.controller';
import { BlogService } from './blog/application/blog.service';
import { BlogRepository } from './blog/infrastructure/blog.repository';
import { BlogQueryRepository } from './blog/infrastructure/blog.query.repository';

@Module({
  imports: [],
  controllers: [AppController, BlogController],
  providers: [AppService, BlogService, BlogRepository, BlogQueryRepository],
})
export class AppModule {}
