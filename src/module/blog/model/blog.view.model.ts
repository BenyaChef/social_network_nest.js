import { BlogDocument } from '../schema/blog.schema';

export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  constructor(blogModel: BlogDocument) {
    this.id = blogModel._id.toString();
    this.name = blogModel.name;
    this.description = blogModel.description;
    this.websiteUrl = blogModel.websiteUrl;
    this.createdAt = blogModel.createdAt;
    this.isMembership = blogModel.isMembership;
  }
}
