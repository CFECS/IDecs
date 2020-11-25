import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDao } from '../../dao/service.dao';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceDao])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
