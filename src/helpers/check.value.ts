import { FieldsEnum } from '../enum/fields.enum';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export const toNumber = (value: string, options: ToNumberOptions = {}): number => {

  let newValue: number = Number.parseInt(value || String(options.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = options.default ?? 1;
  }

  if (options.min !== undefined && newValue < options.min) {
    newValue = options.min;
  }

  if (options.max !== undefined && newValue > options.max) {
    newValue = options.max;
  }

  return newValue;
};

export const checkSortDirection = (value: string): string => {
  const asc = 'asc';
  const desc = 'desc';
  return value === (asc || desc) ? value : desc;
};

export const checkSortBy = (value: string): string => {
  return !value ? FieldsEnum.createdAt : value;
};


