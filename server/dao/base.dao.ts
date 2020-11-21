import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { ResPaginationDto } from '../dto/res.pagination.dto';

export class BaseDao<T> extends Repository<T> {
  async queryPagination(page: number, limit: number, toPlain = false): Promise<ResPaginationDto<T>> {
    const data = await this.findAndCount({ skip: limit * (page - 1), take: limit });
    return { items: toPlain ? (classToPlain(data[0]) as T[]) : data[0], total: data[1] };
  }
}
