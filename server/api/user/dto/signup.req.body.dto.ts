import { IsEmail, isEmpty, IsObject, IsPhoneNumber, IsString, Matches, ValidateIf } from 'class-validator';
import { config } from '../../../../config';
import { ResponseCodeEnum } from '../../../enum/response.code.enum';
import { BaseResponse } from '../../../common/base.response';

export class SignupReqBodyDto {
  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  email?: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  phone?: string;

  @Matches(new RegExp(config.passwordReg || '.*'), {
    message: BaseResponse.getMsgByCode(ResponseCodeEnum.INVALID_PASSWORD_FORMAT),
  })
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsObject()
  @ValidateIf((object) => isEmpty(object.profile))
  profile = {};
}
