import { IsNumber, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { isNotNullAndUndefined } from '../../validator/is.not.null.and.undefined';

export class ReqAddOrUpdateBodyDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  @ValidateIf((object) => isNotNullAndUndefined(object.description))
  description!: string;

  @IsNumber()
  @Type(() => Number)
  serviceId!: number;
}
