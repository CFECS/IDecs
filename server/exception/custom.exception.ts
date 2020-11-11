import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../common/base.response';

export class CustomException extends HttpException {
  constructor(code: string, httpStatus?: HttpStatus) {
    const response: BaseResponse<void> = {
      head: {
        code,
        message: BaseResponse.getMsgByCode(code),
      },
    };
    super(response, httpStatus || HttpStatus.OK);
  }
}
