import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Builder, Nuxt } from 'nuxt';
import config from '../../nuxt.config';
import { JwtUtil } from '../util/jwt.util';
import { TokenTypeEnum } from '../../common/enum/token.type.enum';
import { Utils } from '../../common/utils';
import { RequestAo } from './request.ao';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger, private readonly jwtUtil: JwtUtil) {}

  private readonly exposeApi = ['/api'];
  private readonly whitelist = [...this.exposeApi, '/api/user/signup', '/api/user/login', '/api/user/ticket/validate'];

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: RequestAo, res: Response, next: Function): Promise<void> {
    this.logger.debug(
      `baseUrl:${req.baseUrl}
      method:${req.method}
      headers:${JSON.stringify(req.headers)}
      query:${JSON.stringify(req.query)}
      params:${JSON.stringify(req.params)}
      body:${JSON.stringify(req.body)}`,
    );
    if (!req.originalUrl.startsWith('/api')) {
      // nuxt
      let nuxt: any;
      if (process.env.mode === 'production') {
        config.dev = false;
        nuxt = new Nuxt(config);
      } else if (process.env.IS_NUXT_ENABLED) {
        nuxt = new Nuxt(config);
        new Builder(nuxt).build();
      }
      return nuxt ? nuxt.render(req, res) : res.send('Nuxt is disabled.');
    }
    if (!this.exposeApi.includes(req.baseUrl)) {
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
    }
    if (!this.whitelist.includes(req.baseUrl)) {
      // validate token
      req.payload = await this.jwtUtil.verifyToken(req.cookies.token, TokenTypeEnum.ACCESS_TOKEN);
    }
    next();
  }
}
