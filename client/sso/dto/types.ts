export enum SMSRequestURLEnum {
  SEND = '/sms',
  VERIFY = '/sms/verify',
}

export enum EmailRequestURLEnum {
  SEND = '/email',
  VERIFY = '/email/verify',
}

export interface DialCodes {
  label: string;
  value: string;
}

export interface StringKeyAndValue {
  [propName: string]: string;
}
