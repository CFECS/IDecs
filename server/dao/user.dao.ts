import { EntityRepository, Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { UserModel } from '../model/rds/user.model';
import { ResPaginationDto } from '../dto/res.pagination.dto';

@EntityRepository(UserModel)
export class UserDao extends Repository<UserModel> {
  getOneByEmail(email: string): Promise<UserModel | undefined> {
    return this.findOne({ email });
  }

  getOneByPhone(phone: string): Promise<UserModel | undefined> {
    return this.findOne({ phone });
  }

  async queryPagination(page: number, limit: number): Promise<ResPaginationDto<UserModel>> {
    const data = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      order: { id: 'ASC' },
    });
    return { items: classToPlain(data[0]) as UserModel[], total: data[1] };
  }
}
