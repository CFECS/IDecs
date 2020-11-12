import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../common/base.response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const resData = BaseResponse.successful(data);
        this.logger.debug('response:', JSON.stringify(resData));
        return resData;
      }),
    );
  }
}
