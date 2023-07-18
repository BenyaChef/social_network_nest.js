import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Query} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";
import {UserQueryRepository} from "../infrastructure/user.query.repository";
import {UserService} from "../application/user.service";
import {CreateUserDto} from "../dto/create.user.dto";
import {UserViewModel} from "../model/user.view.model";

@Controller('users')
export class UserController {
    constructor(protected userQueryRepository: UserQueryRepository,
                protected userService: UserService) {
    }
    @Get()
    async getAllUsers(@Query() query: UserQueryPaginationDto) {
        const findUsers = await this.userQueryRepository.getAllUsers(query)
        if(findUsers.items.length <= 0) throw new NotFoundException()
        return findUsers
    }

    @Post()
    async createUser(@Body() createDto: CreateUserDto): Promise<UserViewModel | null> {
        const newUserId: string = await this.userService.createUser(createDto)
        return this.userQueryRepository.getUserByID(newUserId)
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        const isDeleted = await this.userService.deleteUser(userId)
        if(!isDeleted) throw new NotFoundException()
        return isDeleted
    }
}