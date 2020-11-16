import { IsString, Matches } from 'class-validator';
import { config } from '../../../config';
import { BaseResponse } from '../../../server/common/base.response';
import { ResponseCodeEnum } from '../../enum/response.code.enum';

export class ReqPasswordChangeBodyDto {
  @IsString()
  oldPassword!: string;

  @Matches(new RegExp(config.passwordReg || '.*'), {
    message: BaseResponse.getMsgByCode(ResponseCodeEnum.INVALID_PASSWORD_FORMAT),
  })
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}
