import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      ttl: 10,
      limit: 5,
    };
  }
}