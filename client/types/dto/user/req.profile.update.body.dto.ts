import { isNotEmpty, IsObject, IsString, IsUrl, ValidateIf } from 'class-validator';

export class ReqProfileUpdateBodyDto {
  @IsString()
  @ValidateIf((object) => isNotEmpty(object.username))
  username!: string;

  @IsUrl()
  @ValidateIf((object) => isNotEmpty(object.avatar))
  avatar!: string;

  @IsObject()
  @ValidateIf((object) => isNotEmpty(object.profile))
  profile: Record<string, any> = {};
}
