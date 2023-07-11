import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/api/blog.controller';
import { BlogService } from './blog/application/blog.service';
import { BlogRepository } from './blog/infrastructure/blog.repository';
import { BlogQueryRepository } from './blog/infrastructure/blog.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/schema/blog.schema';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseConfig } from './config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [AppController, BlogController],
  providers: [AppService, BlogService, BlogRepository, BlogQueryRepository],
})
export class AppModule {}
