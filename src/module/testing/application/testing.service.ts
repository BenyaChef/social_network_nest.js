import { TestingRepository } from '../infrastructure/testing.repository';
import { Inject, Injectable } from "@nestjs/common";
import { ITestingRepository } from "../infrastructure/interfaces/interface.testing-repository";

@Injectable()
export class TestingService {
  constructor(readonly testingRepository: ITestingRepository) {}

  async deleteAllData() {
    return this.testingRepository.deleteAllData();
  }
}
