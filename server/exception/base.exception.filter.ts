import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { BaseResponse } from '../common/base.response';
import { ResponseCodeEnum } from '../../common/enum/response.code.enum';
import { CustomException } from './custom.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception instanceof CustomException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception instanceof BadRequestException) {
      const msg = (exception.getResponse() as any).message;
      return response.status(HttpStatus.OK).json(BaseResponse.failed(ResponseCodeEnum.WRONG_PARAMETERS, msg));
    }
    return response.status(HttpStatus.OK).json(BaseResponse.failed(ResponseCodeEnum.UNKNOWN_ERROR, exception));
  }
}
