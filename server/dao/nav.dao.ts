import { EntityRepository } from 'typeorm';
import { NavModel } from '../model/rds/nav.model';
import { BaseDao } from './base.dao';

@EntityRepository(NavModel)
export class NavDao extends BaseDao<NavModel> {}
