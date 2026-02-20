import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncRestaurantsHandler } from '../../zelty/commands/sync-restaurants/sync-restaurants.handler';
import { SyncDishesHandler } from '../../zelty/commands/sync-dishes/sync-dishes.handler';
import { SyncOrdersHandler } from '../../zelty/commands/sync-orders/sync-orders.handler';

@Injectable()
export class SyncZeltyJob {
  private readonly logger = new Logger(SyncZeltyJob.name);

  constructor(
    private readonly syncRestaurantsHandler: SyncRestaurantsHandler,
    private readonly syncDishesHandler: SyncDishesHandler,
    private readonly syncOrdersHandler: SyncOrdersHandler,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async execute() {
    this.logger.log('[Scheduler]: Running scheduled sync zelty...');

    await this.syncRestaurantsHandler.execute();
    await this.syncDishesHandler.execute();
    await this.syncOrdersHandler.execute();

    this.logger.log('[Scheduler]: Scheduled sync zelty completed.');
  }
}
