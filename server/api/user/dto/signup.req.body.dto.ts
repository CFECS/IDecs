import { IsEmail, isEmpty, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class SignupReqBodyDto {
  @IsString()
  username!: string;

  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  email?: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  phone?: string;

  @IsString()
  password!: string;

  @IsString()
  confirmPassword!: string;
}
