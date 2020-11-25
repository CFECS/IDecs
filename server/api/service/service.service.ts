import { Injectable } from '@nestjs/common';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ServiceDao } from '../../dao/service.dao';
import { ReqAddOrUpdateBodyDto } from '../../dto/service/req.add.or.update.body.dto';
import { ServiceModel } from '../../model/rds/service.model';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceDao: ServiceDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto) {
    await this.serviceDao.insert(bodyDto);
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto) {
    await this.serviceDao.update(id, bodyDto);
  }

  async removeById(id: number) {
    await this.serviceDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<ServiceModel>> {
    return this.serviceDao.queryPagination(page, limit, true);
  }

  getById(id: number): Promise<ServiceModel | undefined> {
    return this.serviceDao.findOne(id);
  }
}
