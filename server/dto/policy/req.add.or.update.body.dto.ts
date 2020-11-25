import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReqAddOrUpdateBodyDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Type(() => Number)
  serviceId!: number;
}
