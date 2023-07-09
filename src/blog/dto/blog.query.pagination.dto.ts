import { FieldsEnum } from '../../enum/fields.enum';
import { SortDirectionEnum } from '../../enum/sort.direction.enum';

export class BlogQueryPaginationDto {
  searchNameTerm: string | null = null;
  sortBy: FieldsEnum = FieldsEnum.createdAt;
  sortDirection: SortDirectionEnum = SortDirectionEnum.desc;
  pageNumber = 1;
  pageSize = 10;
}
