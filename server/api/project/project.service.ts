import { Injectable } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { ProjectDao } from '../../dao/project.dao';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ProjectModel } from '../../model/rds/project.model';

@Injectable()
export class ProjectService {
  constructor(private readonly projectDao: ProjectDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto, addBy: number) {
    await this.projectDao.insert({ createdById: addBy, updatedById: addBy, ...bodyDto });
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto, updateBy: number) {
    await this.projectDao.update(id, { updatedById: updateBy, ...bodyDto });
  }

  async removeById(id: number) {
    await this.projectDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<ProjectModel>> {
    return this.projectDao.queryPagination(page, limit, true);
  }

  async getById(id: number): Promise<ProjectModel | undefined> {
    const project = await this.projectDao.findOne(id, { relations: ['createdBy', 'updatedBy'] });
    return classToPlain(project) as ProjectModel;
  }
}
