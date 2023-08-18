import { BlogDocument } from "../schema/blog.schema";

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
  banInfo: {
    isBanned: boolean
    banDate: string | null
  }
  constructor(blog: BlogDocument) {
    this.id = blog.id
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.createdAt = blog.createdAt;
    this.isMembership = blog.isMembership;
    this.blogOwnerInfo = {
      userId: blog.ownerId,
      userLogin: blog.ownerLogin
    };
    this.banInfo = {
      isBanned: blog.isBanned,
      banDate: blog.banDate
    }
  }
}