import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { NotifyTypeEnum } from '../../../common/enum/notify.type.enum';
import { CodeGenerateHelper } from '../../util/code.generate.util';
import { SmsHelper } from '../../util/sms.helper';
import { EmailHelper } from '../../util/email.helper';
import { Otp, OtpDocument } from '../../model/mongo/otp.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../../common/enum/response.code.enum';
import { config } from '../../../config';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailHelper: EmailHelper,
    private readonly smsHelper: SmsHelper,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async sms(phone: string, type: string): Promise<void> {
    await this.typeCheck(type, phone);
    const code = CodeGenerateHelper.generateNumberCode(6);
    const otp = await this.otpModel.findOne({ phone, type }).sort({ seq: 'desc' });
    await this.otpModel.create({ phone, code, type, seq: otp ? otp.seq + 1 : 0 });
    await this.smsHelper.sendSms(code, phone);
  }

  async smsVerify(phone: string, code: string, type: string): Promise<void> {
    if (this.verifySkip(code)) return;
    const data = await this.otpModel.findOne({ phone, type }).sort({ seq: 'desc' });
    if (data?.code !== code) {
      throw new CustomException(ResponseCodeEnum.INVALID_CODE);
    }
  }

  async email(email: string, type: string): Promise<void> {
    await this.typeCheck(type, email);
    const code = CodeGenerateHelper.generateNumberCode(6);
    const otp = await this.otpModel.findOne({ email, type }).sort({ seq: 'desc' });
    await this.otpModel.create({ email, code, type, seq: otp ? otp.seq + 1 : 0 });
    await this.emailHelper.sendEmail(code, email);
  }

  async emailVerify(email: string, code: string, type: string): Promise<void> {
    if (this.verifySkip(code)) return;
    const data = await this.otpModel.findOne({ email, type }).sort({ seq: 'desc' });
    if (data?.code !== code) {
      throw new CustomException(ResponseCodeEnum.INVALID_CODE);
    }
  }

  async typeCheck(type: string, identity: string): Promise<void> {
    const user = await this.userService.checkUserExisted(identity);
    switch (type) {
      case NotifyTypeEnum[NotifyTypeEnum.REGISTER]:
      case NotifyTypeEnum[NotifyTypeEnum.BINDING]:
        if (user) {
          throw new CustomException(ResponseCodeEnum.ALREADY_EXISTED_USER);
        }
        break;
      case NotifyTypeEnum[NotifyTypeEnum.RESET_PASSWORD]:
        if (!user) {
          throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
        }
        break;
      default:
        throw new CustomException(ResponseCodeEnum.UNKNOWN_OTP_TYPE);
    }
  }

  verifySkip(code: string) {
    return config.api.otp.testEnable && code === config.api.otp.code;
  }
}
