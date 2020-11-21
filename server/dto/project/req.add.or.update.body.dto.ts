import { IsString } from 'class-validator';

export class ReqAddOrUpdateBodyDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;
}
