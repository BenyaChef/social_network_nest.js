import { FieldsEnum } from '../../../enum/fields.enum';
import { SortDirectionEnum } from '../../../enum/sort.direction.enum';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  checkSortBy,
  checkSortDirection,
  toNumber,
} from '../../../helpers/check.value';
import { BanStatusEnum } from '../../../enum/ban-status.enum';

export class UserQueryPaginationDto {
  @IsOptional()
  @IsEnum(BanStatusEnum)
  public banStatus: BanStatusEnum;

  @IsOptional()
  public searchLoginTerm: string | null = null;

  @IsOptional()
  public searchEmailTerm: string | null = null;

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