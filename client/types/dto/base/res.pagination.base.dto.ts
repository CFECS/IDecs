import { IsNumber } from 'class-validator';

export class ResPaginationBaseDto {
  @IsNumber()
  current!: number;

  @IsNumber()
  total!: number;
}
