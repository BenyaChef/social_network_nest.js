import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { AuthRefreshJwtGuard } from "../../../guards/auth-refresh.jwt.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { RefreshToken } from "../../../decorators/refresh-token.decorator";
import { exceptionHandler } from "../../../exception/exception.handler";
import { ISessionQueryRepository } from "../../sessions/infrastructure/interfaces/session.query-repository.interface";
import { DeviceViewModel } from "../../sessions/model/device.view.model";
import { CommandBus } from "@nestjs/cqrs";
import {
  DeleteAllSessionsExceptCurrentCommand
} from "../../sessions/application/use-cases/delete.all-sessions.except-current-user.use-case";
import {
  DeleteSessionByDeviceIdCommand
} from "../../sessions/application/use-cases/delete.session-by-deviceId.use-case";


@Controller('security')
export class SecurityController {
  constructor(protected sessionsQueryRepository: ISessionQueryRepository,
              protected commandBus: CommandBus) {
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Get('devices')
  @HttpCode(HttpStatus.OK)
  async getAllSessionsCurrentUser(@CurrentUser() userId: string): Promise<DeviceViewModel> {
    const findResult = await this.sessionsQueryRepository.getAllDeviceCurrentUser(userId)
    return findResult
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllUserSessionExceptCurrent(@RefreshToken() refreshToken: string) {
    const deleteResult = await this.commandBus.execute(new DeleteAllSessionsExceptCurrentCommand(refreshToken))
    if(!deleteResult) throw new UnauthorizedException()
    return deleteResult
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionsByDeviceId(@RefreshToken() refreshToken: string, @Param('deviceId') deviceId: string) {
      const deleteResult = await this.commandBus.execute(new DeleteSessionByDeviceIdCommand(refreshToken, deviceId))
    return exceptionHandler(deleteResult)
  }

}