import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Builder, Nuxt } from 'nuxt';
import config from '../nuxt.config';

@Controller()
export class NuxtController {
  private readonly nuxt: any;

  constructor() {
    if (process.env.mode === 'production') {
      config.dev = false;
      this.nuxt = new Nuxt(config);
    } else if (process.env.IS_NUXT_ENABLED) {
      this.nuxt = new Nuxt(config);
      new Builder(this.nuxt).build();
    }
  }

  @Get('*')
  async root(@Req() req: Request, @Res() res: Response) {
    if (this.nuxt) {
      await this.nuxt.render(req, res);
    } else {
      res.send('Nuxt is disabled.');
    }
  }
}
