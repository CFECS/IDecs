import { IsEmail } from 'class-validator';
import { ReqOtpSendBaseDto } from './req.otp.send.base.dto';

export class ReqOtpSendEmailBodyDto extends ReqOtpSendBaseDto {
  @IsEmail()
  readonly email!: string;
}
