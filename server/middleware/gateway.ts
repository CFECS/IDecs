import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Builder, Nuxt } from 'nuxt';
import config from '../../nuxt.config';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: Request, res: Response, next: Function): void {
    this.logger.debug(
      `originalUrl:${req.originalUrl}
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
    next();
  }
}
