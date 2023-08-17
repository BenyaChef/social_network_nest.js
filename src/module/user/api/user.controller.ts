import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, UseGuards
} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";
import {UserQueryRepository} from "../infrastructure/user.query.repository";
import {CreateUserDto} from "../dto/create.user.dto";
import {UserViewModel} from "../model/user.view.model";
import { BasicAuth } from "../../../guards/basic.auth.guard";
import { CommandBus } from "@nestjs/cqrs";
import { UserCreateCommand } from "../application/user-create.use-case";
import { UserDeleteCommand } from "../application/user-delete.use-case";
import { UserBanDto } from "../dto/user-ban.dto";
import { exceptionHandler } from "../../../exception/exception.handler";
import { UserBanCommand } from "../application/user-ban.use-case";
import { BlogQueryPaginationDto } from "../../blog/dto/blog.query.pagination.dto";
import { BlogQueryRepository } from "../../blog/infrastructure/blog.query.repository";
import { UserBindCommand } from "../application/user-bind.use-case";


@Controller('sa')
export class UserController {
    constructor(protected userQueryRepository: UserQueryRepository,
                protected blogQueryRepository: BlogQueryRepository,
                protected commandBus: CommandBus) {
    }
    @Get('users')
    async getAllUsers(@Query() query: UserQueryPaginationDto) {
        return this.userQueryRepository.getAllUsers(query)
    }

    @Post('users')
    @UseGuards(BasicAuth)
    async createUser(@Body() createDto: CreateUserDto): Promise<UserViewModel | null> {
        const newUserId: string = await this.commandBus.execute(new UserCreateCommand(createDto))
        return this.userQueryRepository.getUserByID(newUserId)
    }

    @Put('users/:userId/ban')
    @UseGuards(BasicAuth)
    @HttpCode(HttpStatus.NO_CONTENT)
    async banUnbanUser(@Body() banDto: UserBanDto, @Param('userId') userId: string) {
        const banResult = await this.commandBus.execute(new UserBanCommand(userId, banDto))
        return exceptionHandler(banResult)
    }

    @Delete('users/:userId')
    @UseGuards(BasicAuth)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('userId') userId: string) {
        const isDeleted = await this.commandBus.execute(new UserDeleteCommand(userId))
        if(!isDeleted) throw new NotFoundException()
        return isDeleted
    }

    @Get('blogs')
    @UseGuards(BasicAuth)
    async findAllBlogsOfOwner(@Query() query: BlogQueryPaginationDto) {
        return this.blogQueryRepository.findAllBlogsOfOwner(query)
    }

    @Put('blogs/:blogId/bind-with-user/:userId')
    @UseGuards(BasicAuth)
    async bindBlog(@Param() params) {
        const resultBind = await this.commandBus.execute(new UserBindCommand(params.userId, params.blogId))
        return exceptionHandler(resultBind)
    }
}