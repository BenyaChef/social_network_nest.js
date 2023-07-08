import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../infrastructure/blog.repository';

@Injectable()
export class BlogService {
  constructor(protected readonly blogRepository: BlogRepository) {}
}
