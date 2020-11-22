import { EntityRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { ProjectModel } from '../model/rds/project.model';
import { ResPaginationDto } from '../dto/res.pagination.dto';
import { BaseDao } from './base.dao';

@EntityRepository(ProjectModel)
export class ProjectDao extends BaseDao<ProjectModel> {
  async queryPagination(page: number, limit: number, toPlain = false): Promise<ResPaginationDto<ProjectModel>> {
    const data = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      relations: ['createdBy', 'updatedBy'],
    });
    return { items: toPlain ? (classToPlain(data[0]) as ProjectModel[]) : data[0], total: data[1] };
  }
}
