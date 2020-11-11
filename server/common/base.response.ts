import { ResponseCodeEnum } from '../enum/response.code.enum';

class ResponseHeader {
  code!: string;
  message!: string;
}

export class BaseResponse<T> {
  head!: ResponseHeader;
  data?: T;

  static successful<T>(data: T): BaseResponse<T> {
    const response = new BaseResponse<T>();
    response.head.code = ResponseCodeEnum.OK;
    response.head.message = this.getMsgByCode(ResponseCodeEnum.OK);
    response.data = data;
    return response;
  }

  static failed<T>(code: string, message?: string): BaseResponse<T> {
    const response = new BaseResponse<T>();
    response.head.code = code;
    response.head.message = message ?? this.getMsgByCode(response.head.code);
    return response;
  }

  static getMsgByCode(code: string): string {
    for (const [key, value] of Object.entries(ResponseCodeEnum)) {
      if (code === value) return key;
    }
    return '';
  }
}
