//
// import {Post, PostDocument} from '../schema/post.schema';
// import {PostRepository} from '../infrastructure/post.repository';
// import {BlogRepository} from '../../blog/infrastructure/blog.repository';
// import {UpdatePostDto} from "../dto/update.post.dto";
// import {BlogDocument} from "../../blog/schema/blog.schema";
// import {Injectable} from "@nestjs/common";
// import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
// import { ResultCode } from "../../../enum/result-code.enum";
// import { UserRepository } from "../../user/infrastructure/user.repository";
// import { ReactionService } from "../../reaction/application/reaction.service";
// import { PostCreateDto } from "../dto/create.post.dto";
//
//
// @Injectable()
// export class PostService {
//     constructor(
//         protected postRepository: PostRepository,
//         protected blogRepository: BlogRepository,
//         protected userRepository: UserRepository,
//         protected reactionService: ReactionService
//     ) {
//     }
//
//     async createPost(inputCreateDto: PostCreateDto, blogId: string): Promise<string | null> {
//         const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(blogId);
//         if (!findBlog) return null;
//         const newPost: Post = Post.createPost(inputCreateDto, findBlog)
//         return this.postRepository.createPost(newPost);
//     }
//
//     async postUpdate(inputUpdateDto: UpdatePostDto, postId: string): Promise<string | null> {
//         const findPost: PostDocument | null = await this.postRepository.getPostById(postId)
//         if (!findPost) return null
//         const findBlog: BlogDocument | null = await this.blogRepository.getBlogById(inputUpdateDto)
//         if (!findBlog) return null
//         findPost.update(inputUpdateDto, findBlog)
//         return this.postRepository.save(findPost)
//     }
//
//     async changeReactionForPost(parentId: string, userId: string, reaction: ReactionStatusEnum) {
//         const post = await this.postRepository.getPostById(parentId)
//         if(!post) return ResultCode.NotFound
//         const user = await this.userRepository.getUserById(userId)
//         if(!user) return ResultCode.NotFound
//         await this.reactionService.updateReactionByParentId(parentId, reaction, user)
//         return ResultCode.Success
//     }
//
//     async deletePost(postId: string) {
//         return this.postRepository.deletePost(postId)
//     }
// }
