import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SyncDishesHandler } from '../../zelty/commands/sync-dishes/sync-dishes.handler';

@Command({
  name: 'sync:dishes',
  description: 'Synchronize the dishes from the Zelty API',
})
export class SyncDishesCommandRunner extends CommandRunner {
  private logger = new Logger(SyncDishesCommandRunner.name);

  constructor(private readonly syncDishesHandler: SyncDishesHandler) {
    super();
  }

  async run() {
    this.logger.debug(`Executing sync:dishes command...`);

    await this.syncDishesHandler.execute();

    this.logger.debug('Command executed successfully.');
  }
}