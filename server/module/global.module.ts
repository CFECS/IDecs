import { Global, Logger, Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDao } from '../dao/rds/user.dao';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserDao])],
  providers: [Repository, Logger],
  exports: [Repository, Logger, TypeOrmModule],
})
export class GlobalModule {}
