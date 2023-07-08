import { Controller, Get, Query } from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    protected readonly blogService: BlogService,
    protected readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: BlogQueryPaginationDto) {
    return this.blogQueryRepository.getAllBlogs(query);
  }
}
