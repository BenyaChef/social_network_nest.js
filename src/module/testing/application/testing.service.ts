import { TestingRepository } from '../infrastructure/testing.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingService {
  constructor(protected testingRepository: TestingRepository) {}
  async deleteAllData() {
    return this.testingRepository.deleteAllData();
  }
}
