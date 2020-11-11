import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { config } from '../config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(config.logger as LogLevel[]);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}

bootstrap().then();
