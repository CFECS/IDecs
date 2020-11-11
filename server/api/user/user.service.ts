import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UserModel } from '../../model/rds/user.model';
import { CatDocument, Session } from '../../model/mongo/session.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { PasswordTool } from '../../util/password.util';
import { SignupReqBodyDto } from './dto/signup.req.body.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModelRepository: Repository<UserModel>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<CatDocument>,
  ) {}

  async signup(signupReqBodyDto: SignupReqBodyDto): Promise<void> {
    const identity = signupReqBodyDto.email ? signupReqBodyDto.email : signupReqBodyDto.phone;
    if (await this.checkUserExisted(<string>identity)) {
      throw new CustomException(ResponseCodeEnum.ALREADY_EXISTED_USER);
    }
    signupReqBodyDto.password = PasswordTool.generateStorePwd(signupReqBodyDto.password);
    await this.userModelRepository.save(signupReqBodyDto);
  }

  async login(): Promise<void> {
    await this.userModelRepository.create();
  }

  async checkUserExisted(identity: string): Promise<boolean> {
    let user;
    if (isEmail(identity)) {
      user = await this.getByEmail(identity);
    } else if (isPhoneNumber(identity, null)) {
      user = await this.getByPhone(identity);
    }
    return !!user;
  }

  getByEmail(email: string): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne({ email });
  }

  getByPhone(phone: string): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne({ phone });
  }

  getById(id: number): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne(id, { withDeleted: false });
  }

  async removeById(id: number): Promise<void> {
    await this.userModelRepository.softDelete(id);
  }
}
