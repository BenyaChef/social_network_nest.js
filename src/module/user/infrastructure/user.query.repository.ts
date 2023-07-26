import {Injectable} from "@nestjs/common";
import {UserQueryPaginationDto} from "../dto/user.query.pagination.dto";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schema/user.schema";
import {FilterQuery, Model} from "mongoose";
import {UserViewModel} from "../model/user.view.model";
import {PaginationViewModel} from "../../../helpers/pagination.view.mapper";

@Injectable()
export class UserQueryRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async getUserByID(userId: string): Promise<UserViewModel | null> {
        const user = await this.userModel.findOne({_id: userId})
        if (!user) return null
        return new UserViewModel(user)
    }

    async getAllUsers(query: UserQueryPaginationDto): Promise<PaginationViewModel<UserViewModel[]>> {

        const filter = {$or: [
                {login: {$regex: query.searchLoginTerm ?? '', $options: 'ix'}},
                {email: {$regex: query.searchEmailTerm ?? '', $options: 'ix'}}
            ]
        }

        return this.findPostsByFilterAndPagination(filter, query)
    }

    private async findPostsByFilterAndPagination(filter: FilterQuery<User>, query: UserQueryPaginationDto): Promise<PaginationViewModel<UserViewModel[]>> {
        const posts: UserDocument[] = await this.userModel
            .find(filter)
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();
        const totalCount = await this.userModel.countDocuments(filter);
        return new PaginationViewModel<UserViewModel[]>(
            totalCount,
            query.pageNumber,
            query.pageSize,
            posts.map((user: UserDocument) => new UserViewModel(user))
        );
    }

}