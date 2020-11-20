import {
  IsEmail,
  isEmpty,
  isNotEmpty,
  IsNumberString,
  IsObject,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ReqSignupBodyDto {
  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  email?: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  phone?: string;

  @IsNumberString()
  code!: string;

  @IsString()
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsObject()
  @ValidateIf((object) => isNotEmpty(object.profile))
  profile: Record<string, any> = {};
}
