import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const username = this.configService.get('DATABASE_USERNAME');
    const password = this.configService.get('DATABASE_PASSWORD');
    const host = this.configService.get('DATABASE_HOST');
    const name = this.configService.get('DATABASE_NAME');
    return {
      uri: `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`,
    };
  }
}
