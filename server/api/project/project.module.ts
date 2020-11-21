import { Module } from '@nestjs/common';
import { ProjectDao } from '../../dao/project.dao';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  providers: [ProjectService, ProjectDao],
  controllers: [ProjectController],
})
export class ProjectModule {}
