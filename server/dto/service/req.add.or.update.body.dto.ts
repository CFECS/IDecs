import { IsString, ValidateIf } from 'class-validator';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqAddOrUpdateBodyDto {
  @IsString()
  name!: string;

  @IsString()
  @ValidateIf((object) => isNotNullAndUndefined(object.description))
  description!: string;

  @IsString()
  navId!: string;

  @IsString()
  navRootId!: string;
}
