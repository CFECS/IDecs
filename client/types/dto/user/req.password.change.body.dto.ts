import { IsString } from 'class-validator';

export class ReqPasswordChangeBodyDto {
  @IsString()
  oldPassword!: string;

  @IsString()
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}
