import { EntityRepository } from 'typeorm';
import { ServiceModel } from '../model/rds/service.model';
import { BaseDao } from './base.dao';

@EntityRepository(ServiceModel)
export class ServiceDao extends BaseDao<ServiceModel> {}
