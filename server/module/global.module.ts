import { Global, Logger, Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../model/rds/user.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [Repository, Logger],
  exports: [Repository, Logger, TypeOrmModule],
})
export class GlobalModule {}
