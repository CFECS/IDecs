import { IsEmail, IsNumberString, IsObject, IsPhoneNumber, IsString, Matches, ValidateIf } from 'class-validator';
import { config } from '../../../config';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { BaseResponse } from '../../common/base.response';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqSignupBodyDto {
  @IsEmail()
  @ValidateIf((object) => isNotNullAndUndefined(object.email))
  email?: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isNotNullAndUndefined(object.phone))
  phone?: string;

  @IsNumberString()
  code!: string;

  @Matches(new RegExp(config.passwordReg || '.*'), {
    message: BaseResponse.getMsgByCode(ResponseCodeEnum.INVALID_PASSWORD_FORMAT),
  })
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsObject()
  @ValidateIf((object) => isNotNullAndUndefined(object.profile))
  profile: Record<string, any> = {};
}
