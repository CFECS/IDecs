import { Injectable } from '@nestjs/common';
import { ReqAddOrUpdateBodyDto } from '../../dto/nav/req.add.or.update.body.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { NavDao } from '../../dao/nav.dao';
import { NavModel } from '../../model/rds/nav.model';

@Injectable()
export class NavService {
  constructor(private readonly navDao: NavDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto) {
    await this.navDao.insert(bodyDto);
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto) {
    await this.navDao.update(id, bodyDto);
  }

  async removeById(id: number) {
    await this.navDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<NavModel>> {
    return this.navDao.queryPagination(page, limit, true);
  }

  getById(id: number): Promise<NavModel | undefined> {
    return this.navDao.findOne(id);
  }
}
