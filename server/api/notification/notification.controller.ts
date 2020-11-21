import { Body, Controller, Post } from '@nestjs/common';
import { ReqOtpSendPhoneBodyDto } from '../../dto/notification/req.otp.send.phone.body.dto';
import { ReqOtpVerifyPhoneBodyDto } from '../../dto/notification/req.otp.verify.phone.body.dto';
import { ReqOtpSendEmailBodyDto } from '../../dto/notification/req.otp.send.email.body.dto';
import { ReqOtpVerifyEmailBodyDto } from '../../dto/notification/req.otp.verify.email.body.dto';
import { NotificationService } from './notification.service';

@Controller('/api')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/sms')
  async sms(@Body() phoneBodyDto: ReqOtpSendPhoneBodyDto): Promise<void> {
    await this.notificationService.sms(phoneBodyDto.phone, phoneBodyDto.type);
  }

  @Post('/sms/verify')
  async smsVerify(@Body() phoneBodyDto: ReqOtpVerifyPhoneBodyDto): Promise<void> {
    await this.notificationService.smsVerify(phoneBodyDto.phone, phoneBodyDto.code, phoneBodyDto.type);
  }

  @Post('/email')
  async email(@Body() emailBodyDto: ReqOtpSendEmailBodyDto): Promise<void> {
    await this.notificationService.email(emailBodyDto.email, emailBodyDto.type);
  }

  @Post('/email/verify')
  async emailVerify(@Body() emailBodyDto: ReqOtpVerifyEmailBodyDto): Promise<void> {
    await this.notificationService.emailVerify(emailBodyDto.email, emailBodyDto.code, emailBodyDto.type);
  }
}
