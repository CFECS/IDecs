import { isNotEmpty, IsObject, IsString, ValidateIf } from 'class-validator';

export class ReqProfileUpdateBodyDto {
  @IsString()
  @ValidateIf((object) => isNotEmpty(object.username))
  username!: string;

  @IsObject()
  @ValidateIf((object) => isNotEmpty(object.profile))
  profile: Record<string, any> = {};
}
