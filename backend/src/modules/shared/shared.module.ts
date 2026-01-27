import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './services/database.service';
import { FilesService } from './services/files.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    FilesService,
  ],
  exports: [
    DatabaseService,
    FilesService,
  ],
})
export class SharedModule {}
