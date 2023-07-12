import {
    Body,
    Controller,
    Get, HttpCode, HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put
} from "@nestjs/common";
import {PostService} from '../application/post.service';
import {PostQueryRepository} from '../infrastructure/post.query.repository';
import {PostQueryPaginationDto} from '../dto/post.query.pagination.dto';
import {PostViewModel} from '../model/post.view.model';
import {CreatePostDto} from '../dto/create.post.dto';
import {UpdatePostDto} from '../dto/update.post.dto';
import {PaginationViewModel} from "../../../helpers/pagination.view.mapper";

@Controller('posts')
export class PostController {
    constructor(
        protected postService: PostService,
        protected postQueryRepository: PostQueryRepository,
    ) {
    }

    @Get()
    async getAllPosts(query: PostQueryPaginationDto): Promise<PaginationViewModel<PostViewModel[]>> {
        return this.postQueryRepository.getAllPosts(query);
    }

    @Get(':postId')
    async getPostById(@Param('postId') postId: string) : Promise<PostViewModel> {
        const post: PostViewModel | null =
            await this.postQueryRepository.getPostById(postId);
        if (!post) throw new NotFoundException();
        return post;
    }

    @Post()
    async createPost(@Body() inputCreateDto: CreatePostDto): Promise<PostViewModel | null> {
        const postId: string | null = await this.postService.createPost(inputCreateDto);
        if (!postId) throw new NotFoundException()
        return this.postQueryRepository.getPostById(postId);
    }

    @Put('postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(@Body() inputUpdateDto: UpdatePostDto, @Param('postId') postId: string) {
        const resultUpdate: string | null = await this.postService.postUpdate(inputUpdateDto, postId)
        if (!resultUpdate) throw new NotFoundException()
    }
}
