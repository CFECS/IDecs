import { EntityRepository } from 'typeorm';
import { PolicyModel } from '../model/rds/policy.model';
import { BaseDao } from './base.dao';

@EntityRepository(PolicyModel)
export class PolicyDao extends BaseDao<PolicyModel> {}
