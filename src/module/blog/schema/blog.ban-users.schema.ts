import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserDocument } from "../../user/schema/user.schema";
import { randomUUID } from "crypto";
import { BlogBanDto } from "../dto/blog.ban.dto";


@Schema({versionKey: false})
export class BlogBanUsers {

  @Prop({type: String})
  id: string

  @Prop({type: String})
  blogId: string

  @Prop({type: Boolean})
  isBanned: boolean

  @Prop({type: String})
  banReason: string

  @Prop({type: String})
  banData: string

  @Prop({type: String})
  userId: string

  @Prop({type: String})
  userLogin: string

  static createBanInfoUser(banInfoDto: BlogBanDto, user: UserDocument): BlogBanUsers {
    const newBanInfo = new BlogBanUsers()
    newBanInfo.id = randomUUID()
    newBanInfo.blogId = banInfoDto.blogId
    newBanInfo.userId = user.id
    newBanInfo.userLogin = user.accountData.login
    newBanInfo.isBanned = banInfoDto.isBanned
    newBanInfo.banData = new Date().toISOString()
    newBanInfo.banReason = banInfoDto.banReason
    return newBanInfo
  }
}

export const BlogBanUsersSchema = SchemaFactory.createForClass(BlogBanUsers);
export type BlogBanUsersDocument = HydratedDocument<BlogBanUsers>
BlogBanUsersSchema.statics.createBanInfoUser = BlogBanUsers.createBanInfoUser