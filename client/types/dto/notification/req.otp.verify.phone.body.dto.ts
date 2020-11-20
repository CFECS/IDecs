import { IsPhoneNumber } from 'class-validator';
import { ReqOtpVerifyBaseDto } from './req.otp.verify.base.dto';

export class ReqOtpVerifyPhoneBodyDto extends ReqOtpVerifyBaseDto {
  @IsPhoneNumber(null)
  readonly phone!: string;
}
