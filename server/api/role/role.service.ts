import { Injectable } from '@nestjs/common';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { RoleDao } from '../../dao/role.dao';
import { RoleModel } from '../../model/rds/role.model';
import { ReqAddOrUpdateBodyDto } from '../../dto/role/req.add.or.update.body.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleDao: RoleDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto) {
    await this.roleDao.insert(bodyDto);
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto) {
    await this.roleDao.update(id, bodyDto);
  }

  async removeById(id: number) {
    await this.roleDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<RoleModel>> {
    return this.roleDao.queryPagination(page, limit, true);
  }

  getById(id: number): Promise<RoleModel | undefined> {
    return this.roleDao.findOne(id);
  }
}
