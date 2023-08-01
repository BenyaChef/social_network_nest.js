import { Injectable } from '@nestjs/common';
import { UserQueryPaginationDto } from '../dto/user.query.pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserViewModel } from '../model/user.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { LoginDto } from '../../auth/dto/login.dto';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByCode(code: string): Promise<UserDocument | null> {
    return this.userModel.findOne({'emailInfo.confirmationCode': code})
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
      return this.userModel.findOne({'accountData.login': login})
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({'accountData.email': email})
  }

  async findUserLoginOrEmail(loginDto: LoginDto): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ 'accountData.login': loginDto.loginOrEmail }, {'accountData.email': loginDto.loginOrEmail }],
    });
  }

  async getUserByID(userId: string): Promise<UserViewModel | null> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return null;
    return new UserViewModel(user);
  }

  async getAllUsers(
    query: UserQueryPaginationDto,
  ): Promise<PaginationViewModel<UserViewModel[]>> {
    const filter = {
      $or: [
        { 'accountData.login': { $regex: query.searchLoginTerm ?? '', $options: 'ix' } },
        { 'accountData.email': { $regex: query.searchEmailTerm ?? '', $options: 'ix' } },
      ],
    };

    return this.findPostsByFilterAndPagination(filter, query);
  }

  private async findPostsByFilterAndPagination(
    filter: FilterQuery<User>,
    query: UserQueryPaginationDto,
  ): Promise<PaginationViewModel<UserViewModel[]>> {
    const posts: UserDocument[] = await this.userModel
      .find(filter)
      .sort({[`accountData.${query.sortBy}`]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
    const totalCount = await this.userModel.countDocuments(filter);
    return new PaginationViewModel<UserViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((user: UserDocument) => new UserViewModel(user)),
    );
  }
}
