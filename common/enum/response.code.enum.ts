export enum ResponseCodeEnum {
  OK = 'I_00000',
  UNKNOWN_ERROR = 'I_00001',
  WRONG_PARAMETERS = 'I_00002',
  INCONSISTENT_PASSWORD = 'I_00003',
  ALREADY_EXISTED_USER = 'I_00004',
  INVALID_PASSWORD_FORMAT = 'I_00005',
  UNKNOWN_LOGIN_TYPE = 'I_00006',
  USER_NOT_EXIST = 'I_00007',
  WRONG_PASSWORD = 'I_00008',
  UNKNOWN_TOKEN_TYPE = 'I_00009',
  TOKEN_EXPIRED = 'I_00010',
  INVALID_TOKEN = 'I_00011',
  SMS_SENT_FAILED = 'I_00012',
  UNKNOWN_SMS_VENDOR = 'I_00013',
  EMAIL_SENT_FAILED = 'I_00014',
  UNKNOWN_OTP_TYPE = 'I_00015',
  INVALID_CODE = 'I_00016',
}
