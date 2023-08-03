import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Query, UseGuards
} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";
import {UserQueryRepository} from "../infrastructure/user.query.repository";
import {UserService} from "../application/user.service";
import {CreateUserDto} from "../dto/create.user.dto";
import {UserViewModel} from "../model/user.view.model";
import { BasicAuth } from "../../../guards/basic.auth.guard";


@Controller('users')
export class UserController {
    constructor(protected userQueryRepository: UserQueryRepository,
                protected userService: UserService) {
    }
    @Get()
    async getAllUsers(@Query() query: UserQueryPaginationDto) {
        const findUsers = await this.userQueryRepository.getAllUsers(query)
        return findUsers
    }

    @Post()
    @UseGuards(BasicAuth)
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createDto: CreateUserDto): Promise<UserViewModel | null> {
        const newUserId = await this.userService.createUser(createDto)
        return this.userQueryRepository.getUserByID(newUserId.id)
    }

    @Delete(':userId')
    @UseGuards(BasicAuth)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('userId') userId: string) {
        const isDeleted = await this.userService.deleteUser(userId)
        if(!isDeleted) throw new NotFoundException()
        return isDeleted
    }
}