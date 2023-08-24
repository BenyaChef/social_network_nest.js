export abstract class ITestingRepository {
  abstract deleteAllData() : Promise<boolean | null>
}

// export const ITestingRepository = Symbol('ITestingRepository')