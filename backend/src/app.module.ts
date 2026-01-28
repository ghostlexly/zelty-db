import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UnhandledExceptionsFilter } from './modules/core/filters/unhandled-exceptions.filter';
import { JwtAuthGuard } from './modules/core/guards/jwt-auth.guard';
import { ThrottlerBehindProxyGuard } from './modules/core/guards/throttler-behind-proxy.guard';
import { TrimStringsPipe } from './modules/core/pipes/trim-strings.pipe';
import { SharedModule } from './modules/shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from './modules/core/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ZeltyModule } from './modules/zelty/zelty.module';

@Global()
@Module({
  imports: [
    // -- Libraries
    LoggerModule,
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.APP_REDIS_HOST,
        port: parseInt(process.env.APP_REDIS_PORT ?? '6379'),
      },
    }),
    ThrottlerModule.forRoot({
      errorMessage: 'ThrottlerException: Too Many Requests',
      throttlers: [
        {
          name: 'long',
          ttl: 1 * 60 * 1000, // 1 minute
          limit: 500,
          blockDuration: 1 * 60 * 1000, // 1 minute
        },
      ],
    }),
    CqrsModule.forRoot(),

    // -- Business Modules
    SharedModule,

    ZeltyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },

    // Filters
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionsFilter,
    },

    // Pipes
    {
      provide: APP_PIPE,
      useClass: TrimStringsPipe,
    },
  ],
  exports: [],
})
export class AppModule {}
