import { IsEnum, IsString } from 'class-validator';
import { LoginTypeEnum } from '../../enum/login.type.enum';

export class ReqLoginBodyDto {
  @IsString()
  identity!: string;

  @IsString()
  password!: string;

  @IsEnum(LoginTypeEnum)
  type!: string;
}
