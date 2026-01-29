import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncRestaurantsCommand } from '../../zelty/commands/sync-restaurants/sync-restaurants.command';

@Injectable()
export class SyncZeltyJob {
  private readonly logger = new Logger(SyncZeltyJob.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async execute() {
    this.logger.log('[Scheduler]: Running scheduled sync zelty...');

    await this.commandBus.execute(new SyncRestaurantsCommand());

    this.logger.log('[Scheduler]: Scheduled sync zelty completed.');
  }
}
