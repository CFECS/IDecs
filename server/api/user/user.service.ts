import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail, isPhoneNumber } from 'class-validator';
import { generate } from 'short-uuid';
import { classToPlain } from 'class-transformer';
import { UserModel } from '../../model/rds/user.model';
import { Session, SessionDocument } from '../../model/mongo/session.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../../common/enum/response.code.enum';
import { PasswordUtil } from '../../util/password.util';
import { ReqSignupBodyDto } from '../../../common/dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../../common/dto/user/req.login.body.dto';
import { LoginTypeEnum } from '../../../common/enum/login.type.enum';
import { JwtUtil } from '../../util/jwt.util';
import { TokenTypeEnum } from '../../../common/enum/token.type.enum';
import { Utils } from '../../../common/utils';
import { ResLoginDto } from '../../../common/dto/user/res.login.dto';
import { ResTokenValidateDto } from '../../../common/dto/user/res.token.validate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModelRepository: Repository<UserModel>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly jwtUtil: JwtUtil,
  ) {}

  async signup(signupReqBodyDto: ReqSignupBodyDto): Promise<void> {
    const identity = signupReqBodyDto.email ? signupReqBodyDto.email : signupReqBodyDto.phone;
    if (await this.checkUserExisted(<string>identity)) {
      throw new CustomException(ResponseCodeEnum.ALREADY_EXISTED_USER);
    }
    signupReqBodyDto.password = PasswordUtil.generateStorePwd(signupReqBodyDto.password);
    await this.userModelRepository.save(signupReqBodyDto);
  }

  async login(loginReqBodyDto: ReqLoginBodyDto): Promise<ResLoginDto> {
    let user;
    switch (loginReqBodyDto.type) {
      case LoginTypeEnum.PASSWORD:
        user = await this.loginByPassword(loginReqBodyDto.identity, loginReqBodyDto.password);
        break;
      default:
        throw new CustomException(ResponseCodeEnum.UNKNOWN_LOGIN_TYPE);
    }
    const ticket = JwtUtil.signTicket({ sub: Utils.toBase64(user.id.toString()), type: TokenTypeEnum.TICKET });
    return { ticket };
  }

  async loginByPassword(identity: string, password: string): Promise<UserModel> {
    const user = await this.checkUserExisted(identity);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    if (!PasswordUtil.verifyPwd(password, user.password)) {
      throw new CustomException(ResponseCodeEnum.WRONG_PASSWORD);
    }
    return user;
  }

  async validateTicket(ticket: string): Promise<ResTokenValidateDto> {
    const payload = await this.jwtUtil.verifyToken(ticket, TokenTypeEnum.TICKET);
    const userId = Utils.decodeBase64(payload.sub);
    const user = await this.getById(Number.parseInt(userId));
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    const sessionId = generate();
    await this.sessionModel.create({
      sessionId,
      profile: user,
    });
    const token = JwtUtil.signAccessToken({
      sub: Utils.toBase64(user.id.toString()),
      sessionId,
      type: TokenTypeEnum.ACCESS_TOKEN,
    });
    return { token };
  }

  async checkUserExisted(identity: string): Promise<UserModel | undefined> {
    let user;
    if (isEmail(identity)) {
      user = await this.getByEmail(identity);
    } else if (isPhoneNumber(identity, null)) {
      user = await this.getByPhone(identity);
    }
    return user;
  }

  getByEmail(email: string): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne({ email });
  }

  getByPhone(phone: string): Promise<UserModel | undefined> {
    return this.userModelRepository.findOne({ phone });
  }

  async getById(id: number): Promise<UserModel | undefined> {
    return classToPlain(await this.userModelRepository.findOne(id)) as UserModel;
  }

  async removeById(id: number): Promise<void> {
    await this.userModelRepository.softDelete(id);
  }

  async userPagination(page: number, limit: number): Promise<ResPaginationDto<UserModel>> {
    const data = await this.userModelRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      order: { id: 'ASC' },
    });
    return { items: classToPlain(data[0]) as UserModel[], total: data[1] };
  }
}
