import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NuxtController } from './controllers/nuxt.controller';

const controllers = [AppController] as any[];
controllers.push(NuxtController);

@Module({
  imports: [],
  controllers,
  providers: [AppService],
})
export class AppModule {}
