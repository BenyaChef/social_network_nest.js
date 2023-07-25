import { FieldsEnum } from '../../../enum/fields.enum';
import { SortDirectionEnum } from '../../../enum/sort.direction.enum';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { checkSortBy, checkSortDirection, toNumber } from "../../../helpers/check.value";

export class BlogQueryPaginationDto {
  @IsOptional()
  public searchNameTerm: string | null = null;

  @IsOptional()
  @Transform(({value}) => checkSortBy(value))
  public sortBy: string | null = FieldsEnum.createdAt;

  @IsOptional()
  @Transform(({value}) => checkSortDirection(value))
  @IsEnum(SortDirectionEnum)
  public sortDirection: SortDirectionEnum = SortDirectionEnum.desc;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, {min: 1, default: 1}))
  @IsNumber()
  public pageNumber: number;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, {min: 1, default: 10}))
  @IsNumber()
  public pageSize: number;
}
