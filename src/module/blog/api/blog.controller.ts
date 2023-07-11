import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { UpdateBlogDto } from '../dto/update.blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    protected readonly blogService: BlogService,
    protected readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string) {
    const blog = await this.blogQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Get()
  async getAllBlogs(@Query() query: BlogQueryPaginationDto) {
    return this.blogQueryRepository.getAllBlogs(query);
  }

  @Post()
  async createBlog(@Body() body: CreateBlogDto) {
    const blogId = await this.blogService.createBlog(body);
    return this.blogQueryRepository.getBlogById(blogId);
  }

  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Body() body: UpdateBlogDto, @Param('blogId') blogId: string) {
    const blog = await this.blogQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return this.blogService.updateBlog(body, blogId)
  }

  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('blogId')  blogId: string) {
    const isDeleted = await this.blogService.deleteBlog(blogId)
    if(!isDeleted) throw new NotFoundException()
  }
}
