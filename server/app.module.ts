import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NuxtController } from './controller/nuxt.controller';

@Module({
  imports: [TypeOrmModule.forRoot(config.database)],
  controllers: [AppController, NuxtController],
  providers: [AppService, Logger],
})
export class AppModule {}
