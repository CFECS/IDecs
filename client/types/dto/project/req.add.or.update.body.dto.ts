import { IsNumber, IsString } from 'class-validator';

export class ReqAddOrUpdateBodyDto {
  @IsNumber()
  id?: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;
}
