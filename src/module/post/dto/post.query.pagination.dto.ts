import { SortDirectionEnum } from "../../../enum/sort.direction.enum";
import { FieldsEnum } from "../../../enum/fields.enum";

export class PostQueryPaginationDto {
  public sortBy: FieldsEnum;
  public sortDirection: SortDirectionEnum;
  public pageNumber: number;
  public pageSize: number;
  constructor(query: PostQueryPaginationDto) {
    this.sortBy = !query.sortBy ? FieldsEnum.createdAt : query.sortBy
    this.sortDirection = query.sortDirection
    this.pageNumber = !query.pageNumber ? 1 : +query.pageNumber
    this.pageSize = !query.pageSize ? 10 : +query.pageSize;
  }
}