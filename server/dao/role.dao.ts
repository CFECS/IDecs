import { EntityRepository } from 'typeorm';
import { RoleModel } from '../model/rds/role.model';
import { BaseDao } from './base.dao';

@EntityRepository(RoleModel)
export class RoleDao extends BaseDao<RoleModel> {}
