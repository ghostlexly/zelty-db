import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SyncRestaurantsHandler } from '../../zelty/commands/sync-restaurants/sync-restaurants.handler';

@Command({
  name: 'sync:restaurants',
  description: 'Synchronize the restaurants from the Zelty API',
})
export class SyncRestaurantsCommandRunner extends CommandRunner {
  private logger = new Logger(SyncRestaurantsCommandRunner.name);

  constructor(private readonly syncRestaurantsHandler: SyncRestaurantsHandler) {
    super();
  }

  async run() {
    this.logger.debug(`Executing sync:restaurants command...`);

    await this.syncRestaurantsHandler.execute();

    this.logger.debug('Command executed successfully.');
  }
}
