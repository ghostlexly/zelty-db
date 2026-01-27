import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BasicCommand } from './commands/basic.command';

@Module({
  imports: [
    // -- Libraries
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.APP_REDIS_HOST,
        port: parseInt(process.env.APP_REDIS_PORT ?? '6379'),
      },
    }),
    CqrsModule.forRoot(),

    SharedModule,
  ],
  providers: [
    // Commands
    BasicCommand,

    // Seeders
  ],
})
export class CliModule {}
