import { Module } from '@nestjs/common';
import { ZeltyService } from './zelty.service';
import { SyncRestaurantsHandler } from './commands/sync-restaurants/sync-restaurants.handler';

const CommandHandlers = [SyncRestaurantsHandler];

@Module({
  providers: [...CommandHandlers, ZeltyService],
})
export class ZeltyModule {}
