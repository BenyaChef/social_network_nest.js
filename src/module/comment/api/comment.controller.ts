import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";

@Controller("comments")
export class CommentController {
  constructor() {
  }

  @Get(":commentId")
  @HttpCode(HttpStatus.OK)
  async getCommentById(@Param('commentId') commentId: string) {

  }
}