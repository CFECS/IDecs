import { IsNumber, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqAddOrUpdateBodyDto {
  @IsString()
  name!: string;

  @IsString()
  @ValidateIf((object) => isNotNullAndUndefined(object.description))
  description!: string;

  @IsNumber()
  @Type(() => Number)
  navId!: number;

  @IsNumber()
  @Type(() => Number)
  navRootId!: number;
}
