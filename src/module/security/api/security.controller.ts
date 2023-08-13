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
import { SessionQueryRepository } from "../../sessions/infrastructure/session.query.repository";
import { RefreshToken } from "../../../decorators/refresh-token.decorator";
import { SessionService } from "../../sessions/application/session.service";
import { exceptionHandler } from "../../../exception/exception.handler";


@Controller('security')
export class SecurityController {
  constructor(protected sessionsService: SessionService,
              protected sessionsQueryRepository: SessionQueryRepository) {
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Get('devices')
  @HttpCode(HttpStatus.OK)
  async getAllSessionsCurrentUser(@CurrentUser() userId: string) {
    return this.sessionsQueryRepository.getAllDeviceCurrentUser(userId)
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllUserSessionExceptCurrent(@RefreshToken() refreshToken: string) {
    const deleteResult = await this.sessionsService.deleteAllUserSessionExceptCurrent(refreshToken)
    if(!deleteResult) throw new UnauthorizedException()
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionsByDeviceId(@RefreshToken() refreshToken: string, @Param('deviceId') deviceId: string) {
      const deleteResult = await this.sessionsService.deleteSessionsByDeviceId(refreshToken, deviceId)
    return exceptionHandler(deleteResult)
  }

}