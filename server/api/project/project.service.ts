import { Injectable } from '@nestjs/common';
import { ProjectDao } from '../../dao/project.dao';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ProjectModel } from '../../model/rds/project.model';

@Injectable()
export class ProjectService {
  constructor(private readonly projectDao: ProjectDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto, addBy: number) {
    await this.projectDao.create({ createdBy: addBy, updatedBy: addBy, ...bodyDto });
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto, updateBy: number) {
    await this.projectDao.update(id, { updatedBy: updateBy, ...bodyDto });
  }

  async removeById(id: number) {
    await this.projectDao.delete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<ProjectModel>> {
    return this.projectDao.queryPagination(page, limit);
  }

  getById(id: number): Promise<ProjectModel | undefined> {
    return this.projectDao.findOne(id);
  }
}
