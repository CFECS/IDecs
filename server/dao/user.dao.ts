import { EntityRepository } from 'typeorm';
import { UserModel } from '../model/rds/user.model';
import { BaseDao } from './base.dao';

@EntityRepository(UserModel)
export class UserDao extends BaseDao<UserModel> {
  getOneByEmail(email: string): Promise<UserModel | undefined> {
    return this.findOne({ email });
  }

  getOneByPhone(phone: string): Promise<UserModel | undefined> {
    return this.findOne({ phone });
  }
}
