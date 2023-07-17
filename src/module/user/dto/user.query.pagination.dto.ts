import {FieldsEnum} from "../../../enum/fields.enum";
import {SortDirectionEnum} from "../../../enum/sort.direction.enum";

export class UserQueryPaginationDto {
    public searchLoginTerm: string | null;
    public searchEmailTerm: string | null;
    public sortBy: FieldsEnum;
    public sortDirection: SortDirectionEnum;
    public pageNumber: number;
    public pageSize: number;

    constructor(query: UserQueryPaginationDto) {
        this.searchLoginTerm = !query.searchLoginTerm ? null : query.searchLoginTerm;
        this.searchEmailTerm = !query.searchEmailTerm ? null : query.searchEmailTerm;
        this.sortBy = !query.sortBy ? FieldsEnum.createdAt : query.sortBy;
        this.sortDirection = !query.sortDirection
            ? SortDirectionEnum.desc
            : query.sortDirection;
        this.pageNumber = !query.pageNumber ? 1 : +query.pageNumber;
        this.pageSize = !query.pageSize ? 10 : +query.pageSize;
    }
}