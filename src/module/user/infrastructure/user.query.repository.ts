import {Injectable} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";

@Injectable
export class UserQueryRepository {

    async getAllUsers(query: UserQueryPaginationDto) {

    }

}