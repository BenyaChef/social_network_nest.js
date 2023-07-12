import { FieldsEnum } from '../../../enum/fields.enum';
import { SortDirectionEnum } from '../../../enum/sort.direction.enum';

export class BlogQueryPaginationDto {
  public searchNameTerm: string | null;
  public sortBy: FieldsEnum;
  public sortDirection: SortDirectionEnum;
  public pageNumber: number;
  public pageSize: number;

  constructor(query: BlogQueryPaginationDto) {
    this.searchNameTerm = !query.searchNameTerm ? null : query.searchNameTerm;
    this.sortBy = !query.sortBy ? FieldsEnum.createdAt : query.sortBy;
    this.sortDirection = !query.sortDirection
      ? SortDirectionEnum.desc
      : query.sortDirection;
    this.pageNumber = !query.pageNumber ? 1 : +query.pageNumber;
    this.pageSize = !query.pageSize ? 10 : +query.pageSize;
  }
}
