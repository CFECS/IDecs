import { IsEnum } from 'class-validator';
import { NotifyTypeEnum } from '../../enum/notify.type.enum';

export class ReqOtpSendBaseDto {
  @IsEnum(NotifyTypeEnum)
  readonly type!: string;
}
