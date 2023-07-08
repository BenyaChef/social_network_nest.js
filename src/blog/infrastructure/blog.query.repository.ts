import { Injectable } from '@nestjs/common';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';

@Injectable()
export class BlogQueryRepository {
  async getAllBlogs(query: BlogQueryPaginationDto) {
    return this.BlogModel.find(query);
  }
}
