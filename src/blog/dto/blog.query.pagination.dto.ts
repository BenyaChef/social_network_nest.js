import { FieldsEnum } from '../../enum/fields.enum';
import { SortDirectionEnum } from '../../enum/sort.direction.enum';

export type BlogQueryPaginationDto = {
  searchNameTerm: string | null;
  sortBy: FieldsEnum | FieldsEnum.createdAt;
  sortDirection: SortDirectionEnum | SortDirectionEnum.desc;
  pageNumber: number | 1;
  pageSize: number | 10;
};
