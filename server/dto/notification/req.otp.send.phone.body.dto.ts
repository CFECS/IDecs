import { IsPhoneNumber } from 'class-validator';
import { ReqOtpSendBaseDto } from './req.otp.send.base.dto';

export class ReqOtpSendPhoneBodyDto extends ReqOtpSendBaseDto {
  @IsPhoneNumber(null)
  readonly phone!: string;
}
