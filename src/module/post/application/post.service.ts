import {CreatePostDto} from '../dto/create.post.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Post, PostDocument} from '../schema/post.schema';
import {Model} from 'mongoose';
import {PostRepository} from '../infrastructure/post.repository';
import {BlogRepository} from '../../blog/infrastructure/blog.repository';
import {UpdatePostDto} from "../dto/update.post.dto";
import {BlogDocument} from "../../blog/schema/blog.schema";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        protected postRepository: PostRepository,
        protected blogRepository: BlogRepository,
    ) {
    }

    async createPost(inputCreateDto: CreatePostDto): Promise<string | null> {
        const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(inputCreateDto.blogId);
        if (!findBlog) return null;
        const newPost: PostDocument = new this.postModel(inputCreateDto);
        newPost.blogName = findBlog.name;
        return this.postRepository.save(newPost);
    }

    async postUpdate(inputUpdateDto: UpdatePostDto, postId: string): Promise<string | null> {
        const findPost: PostDocument | null = await this.postRepository.getPostById(postId)
        if (!findPost) return null
        const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(inputUpdateDto.blogId)
        if (!findBlog) return null
        findPost.blogName = findBlog.name
        findPost.blogId = findBlog.id
        findPost.title = inputUpdateDto.title
        findPost.shortDescription = inputUpdateDto.shortDescription
        findPost.content = inputUpdateDto.shortDescription
        return this.postRepository.save(findPost)
    }

    async deletePost(postId: string) {
        return this.postRepository.deletePost(postId)
    }
}
