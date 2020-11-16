import { IsEnum, IsNumberString } from 'class-validator';
import { NotifyTypeEnum } from '../../enum/notify.type.enum';

export class ReqOtpVerifyBaseDto {
  @IsNumberString()
  readonly code!: string;

  @IsEnum(NotifyTypeEnum)
  readonly type!: string;
}
