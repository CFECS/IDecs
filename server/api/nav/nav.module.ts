import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavDao } from '../../dao/nav.dao';
import { NavController } from './nav.controller';
import { NavService } from './nav.service';

@Module({
  imports: [TypeOrmModule.forFeature([NavDao])],
  controllers: [NavController],
  providers: [NavService],
})
export class NavModule {}
