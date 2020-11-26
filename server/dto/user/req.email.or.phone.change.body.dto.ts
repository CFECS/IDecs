import { IsEmail, IsNumberString, IsPhoneNumber, ValidateIf } from 'class-validator';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqEmailOrPhoneChangeBodyDto {
  @IsEmail()
  @ValidateIf((object) => isNotNullAndUndefined(object.email))
  email!: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isNotNullAndUndefined(object.phone))
  phone!: string;

  @IsNumberString()
  code!: string;
}
