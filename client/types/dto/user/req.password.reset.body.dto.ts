import { IsEmail, isEmpty, IsNumberString, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class ReqPasswordResetBodyDto {
  @IsEmail()
  @ValidateIf((object) => isEmpty(object.phone))
  readonly email!: string;

  @IsPhoneNumber(null)
  @ValidateIf((object) => isEmpty(object.email))
  readonly phone!: string;

  @IsNumberString()
  code!: string;

  @IsString()
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}
