import { Module } from '@nestjs/common';
import { ZeltyService } from './zelty.service';
import { SyncRestaurantsHandler } from './commands/sync-restaurants/sync-restaurants.handler';
import { SyncOrdersHandler } from './commands/sync-orders/sync-orders.handler';

const CommandHandlers = [SyncRestaurantsHandler, SyncOrdersHandler];

@Module({
  providers: [...CommandHandlers, ZeltyService],
  exports: [...CommandHandlers]
})
export class ZeltyModule {}
