import { IsEmail, isEmpty, IsNumberString, IsPhoneNumber, ValidateIf } from 'class-validator';

export class ReqEmailOrPhoneChangeBodyDto {
  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  email!: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  phone!: string;

  @IsNumberString()
  code!: string;
}
