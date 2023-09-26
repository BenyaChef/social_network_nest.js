import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthAccessJwtGuard } from "../../../guards/auth-access.jwt.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { AnswerDto } from "../dto/answer.dto";

@Controller('pair-game-quiz')
export class QuizController {
  constructor() {}

  @UseGuards(AuthAccessJwtGuard)
  @Get('pairs/my-current')
  async getUnfinishedCurrentUserGame(@CurrentUser() userId: string) {

  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('pairs/:gameId')
  async getGameById(@Param('gameId') gameId: string, @CurrentUser() userId: string) {

  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('pairs/connection')
  async connectOrCreateGame(@CurrentUser() userId: string) {

  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('pairs/my-current/answers')
  async sendAnswer(@CurrentUser() userId: string, @Body() answerDto: AnswerDto) {

  }

}