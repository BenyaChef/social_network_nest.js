import { FieldsEnum } from '../enum/fields.enum';
import { BanStatusEnum } from "../enum/ban-status.enum";

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export const toNumber = (value: string, options: ToNumberOptions = {}): number => {

  let newValue: number = Number.parseInt(value || String(options.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = options.default ?? NaN;
  }

  if (options.min !== undefined && newValue < options.min) {
    newValue = options.min;
  }

  if (options.max !== undefined && newValue > options.max) {
    newValue = options.max;
  }

  return newValue;
};

export const checkSortDirection = (value: string): number => {
  switch (value) {
    case 'desc': return -1
    case 'asc': return 1
    default: return -1
  }
};

export const checkSortBy = (value: string): string => {
  if(!value) return 'CreatedAt'
  const firstLetter = value.charAt(0).toUpperCase();
  const restOfString = value.slice(1);
  return `${firstLetter}${restOfString}`;
};

export const getBanStatusFilter = (banStatus: BanStatusEnum) => {
  switch (banStatus) {
    case BanStatusEnum.banned: return `b."IsBanned" = ${true}` ;
    case BanStatusEnum.notBanned: return `b."IsBanned" = ${false}` ;
    default: return 'TRUE'
  }
}


