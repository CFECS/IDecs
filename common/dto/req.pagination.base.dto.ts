import { IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ReqPaginationBaseDto {
  @IsPositive()
  @Type(() => Number)
  readonly page = 1;

  @IsPositive()
  @Type(() => Number)
  readonly limit = 20;
}
