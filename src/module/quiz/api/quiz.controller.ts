import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthAccessJwtGuard } from "../../../guards/auth-access.jwt.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { AnswerDto } from "../dto/answer.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePairCommand } from "../application/game.use-case/create-pair.use-case";
import { IQuizQueryRepository } from "../infrastructure/interface/quiz.query-repository.interface";
import { AnswerCommand } from "../application/game.use-case/answer.use-case";


@Controller('pair-game-quiz')
export class QuizController {
  constructor(private commandBus: CommandBus,
              private quizQueryRepository: IQuizQueryRepository) {}

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
    const resultJoin = await this.commandBus.execute(new CreatePairCommand(userId))
    if(!resultJoin) throw new ForbiddenException()
    return this.quizQueryRepository.getGameById(resultJoin)
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('pairs/my-current/answers')
  async sendAnswer(@CurrentUser() userId: string, @Body() answerDto: AnswerDto) {
      const resultAnswer = await this.commandBus.execute(new AnswerCommand(answerDto.answer, userId))
  }

}