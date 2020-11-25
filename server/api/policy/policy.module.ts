import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyDao } from '../../dao/policy.dao';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyDao])],
  controllers: [PolicyController],
  providers: [PolicyService],
})
export class PolicyModule {}
