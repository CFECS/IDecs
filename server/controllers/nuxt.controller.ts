import { Controller, Get, Request, Response } from '@nestjs/common'
import { Builder, Nuxt } from 'nuxt'
import config from '../../nuxt.config'

@Controller()
export class NuxtController {
  nuxt: any
  constructor() {
    if (process.env.mode === 'production') {
      config.dev = false
      this.nuxt = new Nuxt(config)
    } else if (process.env.IS_NUXT_ENABLED) {
      this.nuxt = new Nuxt(config)
      new Builder(this.nuxt).build()
    }
  }

  @Get('*')
  async root(@Request() req, @Response() res) {
    if (this.nuxt) {
      await this.nuxt.render(req, res)
    } else {
      res.send('Nuxt is disabled.')
    }
  }
}
