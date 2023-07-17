import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";
import {UserQueryRepository} from "../infrastructure/user.query.repository";
import {UserService} from "../application/user.service";
import {CreateUserDto} from "../dto/create.user.dto";

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
    async createUser(@Body() createDto: CreateUserDto) {
        const newUserId = await this.userService.createUser(createDto)
    }
}