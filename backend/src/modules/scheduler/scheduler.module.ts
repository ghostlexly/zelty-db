import { Module } from '@nestjs/common';
import { SyncZeltyJob } from './jobs/sync-zelty.job';
import { ZeltyModule } from '../zelty/zelty.module';

@Module({
  imports: [ZeltyModule],
  providers: [SyncZeltyJob],
})
export class SchedulerModule {}
