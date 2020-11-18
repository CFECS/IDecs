import { IsEmail, isEmpty, IsNumberString, IsPhoneNumber, IsString, Matches, ValidateIf } from 'class-validator';
import { config } from '../../../config';
import { BaseResponse } from '../../../server/common/base.response';
import { ResponseCodeEnum } from '../../enum/response.code.enum';

export class ReqPasswordResetBodyDto {
  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  readonly email!: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  readonly phone!: string;

  @IsNumberString()
  code!: string;

  @Matches(new RegExp(config.passwordReg || '.*'), {
    message: BaseResponse.getMsgByCode(ResponseCodeEnum.INVALID_PASSWORD_FORMAT),
  })
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}
