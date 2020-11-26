import { IsObject, IsString, IsUrl, ValidateIf } from 'class-validator';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqProfileUpdateBodyDto {
  @IsString()
  @ValidateIf((object) => isNotNullAndUndefined(object.username))
  username!: string;

  @IsUrl()
  @ValidateIf((object) => isNotNullAndUndefined(object.avatar))
  avatar!: string;

  @IsObject()
  @ValidateIf((object) => isNotNullAndUndefined(object.profile))
  profile: Record<string, any> = {};
}
