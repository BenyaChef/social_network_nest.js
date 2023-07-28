import { SortDirectionEnum } from '../../../enum/sort.direction.enum';
import { FieldsEnum } from '../../../enum/fields.enum';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  checkSortBy,
  checkSortDirection,
  toNumber,
} from '../../../helpers/check.value';

export class PostQueryPaginationDto {

  @IsOptional()
  @Transform(({ value }) => checkSortBy(value))
  public sortBy: string = FieldsEnum.createdAt;

  @IsOptional()
  @Transform(({ value }) => checkSortDirection(value))
  @IsEnum(SortDirectionEnum)
  public sortDirection: SortDirectionEnum = SortDirectionEnum.desc;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 1 }))
  @IsNumber()
  public pageNumber: number = 1;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 10 }))
  @IsNumber()
  public pageSize: number = 10;
}
