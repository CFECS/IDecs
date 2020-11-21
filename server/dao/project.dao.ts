import { EntityRepository } from 'typeorm';
import { ProjectModel } from '../model/rds/project.model';
import { BaseDao } from './base.dao';

@EntityRepository(ProjectModel)
export class ProjectDao extends BaseDao<ProjectModel> {}
