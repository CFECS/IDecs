import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail, isPhoneNumber } from 'class-validator';
import { generate } from 'short-uuid';
import { classToPlain } from 'class-transformer';
import { UserModel } from '../../model/rds/user.model';
import { Session, SessionDocument } from '../../model/mongo/session.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { PasswordUtil } from '../../util/password.util';
import { ReqSignupBodyDto } from '../../dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../dto/user/req.login.body.dto';
import { LoginTypeEnum } from '../../enum/login.type.enum';
import { JwtUtil } from '../../util/jwt.util';
import { TokenTypeEnum } from '../../enum/token.type.enum';
import { Utils } from '../../util/utils';
import { ResLoginDto } from '../../dto/user/res.login.dto';
import { ResTokenValidateDto } from '../../dto/user/res.token.validate.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ReqProfileUpdateBodyDto } from '../../dto/user/req.profile.update.body.dto';
import { UserDao } from '../../dao/user.dao';
import { NotifyTypeEnum } from '../../enum/notify.type.enum';
import { ReqPasswordResetBodyDto } from '../../dto/user/req.password.reset.body.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly jwtUtil: JwtUtil,
    private readonly notificationService: NotificationService,
  ) {}

  async signup(signupBodyDto: ReqSignupBodyDto): Promise<void> {
    if (signupBodyDto.email) {
      await this.notificationService.emailVerify(
        signupBodyDto.email,
        signupBodyDto.code,
        NotifyTypeEnum[NotifyTypeEnum.REGISTER],
      );
    } else if (signupBodyDto.phone) {
      await this.notificationService.smsVerify(
        signupBodyDto.phone,
        signupBodyDto.code,
        NotifyTypeEnum[NotifyTypeEnum.REGISTER],
      );
    } else {
      throw new CustomException(ResponseCodeEnum.EMAIL_OR_PHONE_NUMBER_NEEDED);
    }
    const identity = signupBodyDto.email ? signupBodyDto.email : signupBodyDto.phone;
    if (await this.checkUserExisted(<string>identity)) {
      throw new CustomException(ResponseCodeEnum.ALREADY_EXISTED_USER);
    }
    signupBodyDto.password = PasswordUtil.generateStorePwd(signupBodyDto.password);
    await this.userDao.insert(signupBodyDto);
  }

  async login(loginBodyDto: ReqLoginBodyDto): Promise<ResLoginDto> {
    let user;
    switch (loginBodyDto.type) {
      case LoginTypeEnum.PASSWORD:
        user = await this.loginByPassword(loginBodyDto.identity, loginBodyDto.password);
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
    const token = JwtUtil.signAccessToken({
      sub: Utils.toBase64(user.id.toString()),
      sessionId,
      type: TokenTypeEnum.ACCESS_TOKEN,
    });
    await this.sessionModel.create({
      sessionId,
      profile: user,
      token,
    });
    return { token };
  }

  async checkUserExisted(identity: string): Promise<UserModel | undefined> {
    let user;
    if (isEmail(identity)) {
      user = await this.userDao.getOneByEmail(identity);
    } else if (isPhoneNumber(identity, null)) {
      user = await this.userDao.getOneByPhone(identity);
    }
    return user;
  }

  async getById(id: number, withPassword = false): Promise<UserModel | undefined> {
    const user = await this.userDao.findOne(id);
    return withPassword ? user : (classToPlain(user) as UserModel);
  }

  async removeById(id: number): Promise<void> {
    await this.userDao.softDelete(id);
  }

  userPagination(page: number, limit: number): Promise<ResPaginationDto<UserModel>> {
    return this.userDao.queryPagination(page, limit);
  }

  async passwordChange(id: number, newPassword: string): Promise<void> {
    await this.userDao.update(id, { password: PasswordUtil.generateStorePwd(newPassword) });
  }

  async profileUpdate(id: number, profileUpdateBodyDto: ReqProfileUpdateBodyDto): Promise<void> {
    await this.userDao.update(id, {
      username: profileUpdateBodyDto.username,
      profile: profileUpdateBodyDto.profile,
    });
  }

  async emailChange(id: number, email: string, code: string): Promise<void> {
    await this.notificationService.emailVerify(email, code, NotifyTypeEnum[NotifyTypeEnum.BINDING]);
    await this.userDao.update(id, { email });
  }

  async phoneChange(id: number, phone: string, code: string): Promise<void> {
    await this.notificationService.smsVerify(phone, code, NotifyTypeEnum[NotifyTypeEnum.BINDING]);
    await this.userDao.update(id, { phone });
  }

  async passwordResetByPhone(passwordResetBodyDto: ReqPasswordResetBodyDto) {
    const user = await this.userDao.getOneByPhone(passwordResetBodyDto.phone);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    await this.notificationService.smsVerify(
      user.phone,
      passwordResetBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.RESET_PASSWORD],
    );
    await this.passwordChange(user.id, passwordResetBodyDto.newPassword);
  }

  async passwordResetByEmail(passwordResetBodyDto: ReqPasswordResetBodyDto) {
    const user = await this.userDao.getOneByEmail(passwordResetBodyDto.email);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    await this.notificationService.emailVerify(
      user.email,
      passwordResetBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.RESET_PASSWORD],
    );
    await this.passwordChange(user.id, passwordResetBodyDto.newPassword);
  }
}
