import {CreatePostDto} from '../dto/create.post.dto';
import {Post, PostDocument} from '../schema/post.schema';
import {PostRepository} from '../infrastructure/post.repository';
import {BlogRepository} from '../../blog/infrastructure/blog.repository';
import {UpdatePostDto} from "../dto/update.post.dto";
import {BlogDocument} from "../../blog/schema/blog.schema";
import {Injectable} from "@nestjs/common";


@Injectable()
export class PostService {
    constructor(
        protected postRepository: PostRepository,
        protected blogRepository: BlogRepository,
    ) {
    }

    async createPost(inputCreateDto: CreatePostDto, blogId: string): Promise<string | null> {
        const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(blogId);
        if (!findBlog) return null;
        const newPost: Post = Post.createPost(inputCreateDto, findBlog)
        return this.postRepository.createPost(newPost);
    }

    async postUpdate(inputUpdateDto: UpdatePostDto, postId: string): Promise<string | null> {
        const findPost: PostDocument | null = await this.postRepository.getPostById(postId)
        if (!findPost) return null
        const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(inputUpdateDto.blogId)
        if (!findBlog) return null
        findPost.update(inputUpdateDto, findBlog)
        return this.postRepository.save(findPost)
    }

    async deletePost(postId: string) {
        return this.postRepository.deletePost(postId)
    }
}
