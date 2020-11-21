import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseResponse } from '../common/base.response';
import { ResponseCodeEnum } from '../enum/response.code.enum';
import { CustomException } from './custom.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost): void {
    this.logger.error('Error', exception.toString());
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception instanceof CustomException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception instanceof BadRequestException) {
      const msg = (exception.getResponse() as any).message;
      return response.status(HttpStatus.OK).json(BaseResponse.failed(ResponseCodeEnum.WRONG_PARAMETERS, msg));
    } else if (exception instanceof UnauthorizedException) {
      return response.status(HttpStatus.OK).json(BaseResponse.failed(ResponseCodeEnum.UNAUTHORIZED, ''));
    }
    return response
      .status(HttpStatus.OK)
      .json(BaseResponse.failed(ResponseCodeEnum.UNKNOWN_ERROR, exception.toString()));
  }
}
