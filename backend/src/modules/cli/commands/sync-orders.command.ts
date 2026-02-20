import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SyncOrdersHandler } from '../../zelty/commands/sync-orders/sync-orders.handler';

@Command({
  name: 'sync:orders',
  description: 'Synchronize the orders from the Zelty API',
  arguments: '[fromDate] [toDate]',
  argsDescription: {
    fromDate: 'Start date in YYYY-MM-DD format (default: start of current month minus 1 day)',
    toDate: 'End date in YYYY-MM-DD format (default: end of current month)',
  },
})
export class SyncOrdersCommandRunner extends CommandRunner {
  private logger = new Logger(SyncOrdersCommandRunner.name);

  constructor(private readonly syncOrdersHandler: SyncOrdersHandler) {
    super();
  }

  async run(passedParams: string[]) {
    const [fromDate, toDate] = passedParams;
    this.logger.debug(`Executing sync:orders command...`);

    await this.syncOrdersHandler.execute({
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });

    this.logger.debug('Command executed successfully.');
  }
}
