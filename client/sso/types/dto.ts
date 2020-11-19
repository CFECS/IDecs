import { IsString } from 'class-validator';

export enum SMSRequestURLEnum {
  SEND = '/sms',
  VERIFY = '/sms/verify',
}

export enum EmailRequestURLEnum {
  SEND = '/email',
  VERIFY = '/email/verify',
}

export class DialCodeDto {
  @IsString()
  readonly label!: string;

  @IsString()
  readonly value!: string;
}
