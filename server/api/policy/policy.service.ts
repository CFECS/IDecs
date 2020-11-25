import { Injectable } from '@nestjs/common';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { PolicyDao } from '../../dao/policy.dao';
import { PolicyModel } from '../../model/rds/policy.model';
import { ReqAddOrUpdateBodyDto } from '../../dto/policy/req.add.or.update.body.dto';

@Injectable()
export class PolicyService {
  constructor(private readonly policyDao: PolicyDao) {}

  async add(bodyDto: ReqAddOrUpdateBodyDto) {
    await this.policyDao.insert(bodyDto);
  }

  async updateById(id: number, bodyDto: ReqAddOrUpdateBodyDto) {
    await this.policyDao.update(id, bodyDto);
  }

  async removeById(id: number) {
    await this.policyDao.softDelete(id);
  }

  getAll(page: number, limit: number): Promise<ResPaginationDto<PolicyModel>> {
    return this.policyDao.queryPagination(page, limit, true);
  }

  getById(id: number): Promise<PolicyModel | undefined> {
    return this.policyDao.findOne(id);
  }
}
