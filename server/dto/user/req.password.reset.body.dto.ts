import { IsEmail, IsNumberString, IsPhoneNumber, IsString, Matches, ValidateIf } from 'class-validator';
import { config } from '../../../config';
import { BaseResponse } from '../../common/base.response';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqPasswordResetBodyDto {
  @IsEmail()
  @ValidateIf((object) => isNotNullAndUndefined(object.email))
  readonly email!: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isNotNullAndUndefined(object.phone))
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
