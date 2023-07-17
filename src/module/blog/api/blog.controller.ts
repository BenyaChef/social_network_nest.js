import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {BlogService} from '../application/blog.service';
import {BlogQueryRepository} from '../infrastructure/blog.query.repository';
import {BlogQueryPaginationDto} from '../dto/blog.query.pagination.dto';
import {CreateBlogDto} from '../dto/create.blog.dto';
import {UpdateBlogDto} from '../dto/update.blog.dto';
import {BlogViewModel} from '../model/blog.view.model';
import {PaginationViewModel} from '../../../helpers/pagination.view.mapper';
import {PostService} from "../../post/application/post.service";
import {PostQueryRepository} from "../../post/infrastructure/post.query.repository";
import {CreatePostDto} from "../../post/dto/create.post.dto";
import {PostViewModel} from "../../post/model/post.view.model";
import {isValidObjectId} from "mongoose";
import {PostQueryPaginationDto} from "../../post/dto/post.query.pagination.dto";


@Controller('blogs')
export class BlogController {
    constructor(
        protected readonly blogService: BlogService,
        protected readonly blogQueryRepository: BlogQueryRepository,
        protected readonly postService: PostService,
        protected readonly postQueryRepository: PostQueryRepository
    ) {
    }

    @Get(':blogId')
    async getBlogById(@Param('blogId') blogId: string): Promise<BlogViewModel> {
        const blog: BlogViewModel | null =
            await this.blogQueryRepository.getBlogById(blogId);
        if (!blog) throw new NotFoundException();
        return blog;
    }

    @Get(':blogId/posts')
    async getAllPostByBlogID(@Param('blogId') blogId: string, @Query() query: PostQueryPaginationDto) {
        return this.postQueryRepository.getAllPosts(query, blogId)
    }

    @Get()
    async getAllBlogs(
        @Query() paginationQueryParam: BlogQueryPaginationDto,
    ): Promise<PaginationViewModel<BlogViewModel[]>> {
        return this.blogQueryRepository.getAllBlogs(paginationQueryParam);
    }

    @Post()
    async createBlog(
        @Body() createDto: CreateBlogDto,
    ): Promise<BlogViewModel | null> {
        const blogId: string = await this.blogService.createBlog(createDto);
        return this.blogQueryRepository.getBlogById(blogId);
    }

    @Post(':blogId/posts')
    async createNewPostForBlog(@Body() createDto: CreatePostDto, @Param('blogId') blogId: string): Promise<PostViewModel | null> {
        const newBlogId: string | null = await this.postService.createPost(createDto, blogId)
        if (!newBlogId) throw new NotFoundException()
        return this.postQueryRepository.getPostById(newBlogId)
    }

    @Put(':blogId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Body() updateDto: UpdateBlogDto,
        @Param('blogId') blogId: string,
    ) {
        const blog: BlogViewModel | null =
            await this.blogQueryRepository.getBlogById(blogId);
        if (!blog) throw new NotFoundException();
        return this.blogService.updateBlog(updateDto, blogId);
    }

    @Delete(':blogId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('blogId') blogId: string) {
        const isDeleted: boolean = await this.blogService.deleteBlog(blogId);
        if (!isDeleted) throw new NotFoundException();
    }
}
