import { BlogBanUsersDocument } from "../schema/blog.ban-users.schema";

export class BlogBannedUserViewModel {
  id: string
  login: string
  banInfo: {
    isBanned: boolean
    banDate: string
    banReason: string
  }
  constructor(blogBanInfo: BlogBanUsersDocument) {
    this.id = blogBanInfo.userId
    this.login = blogBanInfo.userLogin
    this.banInfo = {
      isBanned: blogBanInfo.isBanned,
      banDate: blogBanInfo.banData,
      banReason: blogBanInfo.banReason
    }
  }
}