import { Global, Logger, Module } from '@nestjs/common';
import { Repository } from 'typeorm';

@Global()
@Module({
  providers: [Repository, Logger],
  exports: [Repository, Logger],
})
export class GlobalModule {}
