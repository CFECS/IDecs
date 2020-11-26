import { IsNumber } from 'class-validator';

export class ReqPaginationBaseDto {
  @IsNumber()
  page!: number;

  @IsNumber()
  limit!: number;
}
