import { Injectable } from '@nestjs/common';
import { ITestingRepository } from './interfaces/interface.testing-repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlTestingRepository implements ITestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllData(): Promise<boolean | null> {
    await this.dataSource.query(`SELECT truncate_tables('postgres');`);
      return true;
  }
}