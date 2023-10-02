import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { checkSortBy, checkSortDirection, toNumber } from "../../../../helpers/check.value";
import { FieldsEnum } from "../../../../enum/fields.enum";
import { SortDirectionEnum } from "../../../../enum/sort.direction.enum";
import { PublishedStatusEnum } from "../../../../enum/published-status.enum";


export class QuestionQueryDto {
  @IsOptional()
  bodySearchTerm: string | null = null

  @IsOptional()
  @IsEnum(PublishedStatusEnum)
  publishedStatus: PublishedStatusEnum

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