import { Injectable } from '@nestjs/common';
import { ProjectDao } from '../../dao/project.dao';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ProjectModel } from '../../model/rds/project.model';

@Injectable()
export class ProjectService {
  constructor(private readonly projectDao: ProjectDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto, addBy: string) {
    await this.projectDao.insert({ createdById: addBy, updatedById: addBy, ...bodyDto });
  }

  async updateById(id: string, bodyDto: ReqAddOrUpdateBodyDto, updateBy: string) {
    await this.projectDao.update(id, { updatedById: updateBy, ...bodyDto });
  }

  async removeById(id: string) {
    await this.projectDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<ProjectModel>> {
    return this.projectDao.queryPagination(page, limit, true);
  }

  getById(id: string): Promise<ProjectModel | undefined> {
    return this.projectDao.findOne(id, { relations: ['createdBy', 'updatedBy'] });
  }
}
