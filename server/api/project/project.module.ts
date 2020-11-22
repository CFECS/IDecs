import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDao } from '../../dao/project.dao';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectDao])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
