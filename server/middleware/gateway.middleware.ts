import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtUtil } from '../util/jwt.util';
import { TokenTypeEnum } from '../../common/enum/token.type.enum';
import { Utils } from '../../common/utils';
import { RequestAo } from './request.ao';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  private readonly whitelist = [
    '/api/user/signup',
    '/api/user/login',
    '/api/user/ticket/validate',
    '/api/sms',
    '/api/email',
    '/api/sms/verify',
    '/api/email/verify',
    '/api/user/password/reset/phone',
    '/api/user/password/reset/email',
  ];

  constructor(private readonly logger: Logger, private readonly jwtUtil: JwtUtil) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: RequestAo, res: Response, next: Function): Promise<any> {
    this.logger.debug(
      `baseUrl:${req.baseUrl}
      method:${req.method}
      headers:${JSON.stringify(req.headers)}
      query:${JSON.stringify(req.query)}
      params:${JSON.stringify(req.params)}
      body:${JSON.stringify(req.body)}`,
    );
    // api key
    const timestamp = Number.parseInt(req.header('timestamp') || '0');
    if (Date.now() - timestamp > 1000 * 60) {
      this.logger.error('timestamp mismatching');
      throw new UnauthorizedException();
    }
    if (req.header('api-key') !== Utils.generateApiKey(timestamp, req.baseUrl)) {
      this.logger.error('api-key error');
      throw new UnauthorizedException();
    }
    // verify token
    if (!this.whitelist.includes(req.baseUrl)) {
      req.payload = await this.jwtUtil.verifyToken(req.cookies.token, TokenTypeEnum.ACCESS_TOKEN);
    }
    next();
  }
}
