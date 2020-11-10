import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../../model/rds/user.model';
import { CatDocument, Session } from '../../model/mongo/session.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModelRepository: Repository<UserModel>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<CatDocument>,
  ) {}

  getById(id: number): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne(id, { withDeleted: false });
  }

  async removeById(id: number): Promise<void> {
    await this.userModelRepository.softDelete(id);
  }
}
