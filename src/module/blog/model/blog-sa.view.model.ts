import { BlogDocument } from "../schema/blog.schema";
import { UserDocument } from "../../user/schema/user.schema";

export class BlogSaViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  blogOwnerInfo: {
    userId: string,
    userLogin: string
  }
  constructor(blog: BlogDocument, user: UserDocument) {
    this.id = blog.id
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.createdAt = blog.createdAt;
    this.isMembership = blog.isMembership;
    this.blogOwnerInfo = {
      userId: user.id,
      userLogin: user.accountData.login
    };
  }
}