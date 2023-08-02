import { Injectable } from "@nestjs/common";
import { PostQueryPaginationDto } from "../../post/dto/post.query.pagination.dto";

@Injectable()
export class CommentQueryPaginationDto extends PostQueryPaginationDto {}