import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { CommandBus } from '@nestjs/cqrs';
import { SyncRestaurantsCommand } from '../../zelty/commands/sync-restaurants/sync-restaurants.command';

@Command({
  name: 'sync:restaurants',
  description: 'Synchronize the restaurants from the Zelty API',
})
export class SyncRestaurantsCommandRunner extends CommandRunner {
  private logger = new Logger(SyncRestaurantsCommandRunner.name);

  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async run() {
    this.logger.debug(`Executing sync:restaurants command...`);

    await this.commandBus.execute(new SyncRestaurantsCommand());

    this.logger.debug('Executed');
  }
}
