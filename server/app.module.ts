import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { config } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { GlobalModule } from './module/global.module';
import { GatewayMiddleware } from './middleware/gateway.middleware';
import { ResponseInterceptor } from './middleware/response.interceptor';
import { AllExceptionsFilter } from './exception/base.exception.filter';
import { NuxtController } from './nuxt.controller';
import { NotificationModule } from './api/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config.rds, entities: [`${__dirname}/model/rds/*.ts`] }),
    MongooseModule.forRoot(config.mongoDB.uri, { useCreateIndex: true }),
    GlobalModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [AppController, NuxtController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GatewayMiddleware).forRoutes('/api/*');
  }
}
