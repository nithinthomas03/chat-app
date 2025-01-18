import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigService } from './db.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
