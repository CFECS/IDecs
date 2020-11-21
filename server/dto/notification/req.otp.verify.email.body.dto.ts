import { IsEmail } from 'class-validator';
import { ReqOtpVerifyBaseDto } from './req.otp.verify.base.dto';

export class ReqOtpVerifyEmailBodyDto extends ReqOtpVerifyBaseDto {
  @IsEmail()
  readonly email!: string;
}
