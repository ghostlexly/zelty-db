import { Module } from '@nestjs/common';
import { SyncZeltyJob } from './jobs/sync-zelty.job';

@Module({
  providers: [SyncZeltyJob],
})
export class SchedulerModule {}
