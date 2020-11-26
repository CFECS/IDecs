import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { config } from '../../config';
import { UserModule } from '../api/user/user.module';
import { GatewayMiddleware } from '../middleware/gateway.middleware';
import { ResponseInterceptor } from '../middleware/response.interceptor';
import { AllExceptionsFilter } from '../exception/base.exception.filter';
import { NotificationModule } from '../api/notification/notification.module';
import { ProjectModule } from '../api/project/project.module';
import { RoleModule } from '../api/role/role.module';
import { ServiceModule } from '../api/service/service.module';
import { PolicyModule } from '../api/policy/policy.module';
import { NavModule } from '../api/nav/nav.module';
import { GlobalModule } from './global.module';
import { NuxtModule } from './nuxt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config.rds, entities: [`${__dirname}/../model/rds/**/*.ts`] }),
    MongooseModule.forRoot(config.mongoDB.uri, { useCreateIndex: true }),
    GlobalModule,
    UserModule,
    NotificationModule,
    ProjectModule,
    RoleModule,
    ServiceModule,
    PolicyModule,
    NavModule,
    NuxtModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GatewayMiddleware).forRoutes('/api/*');
  }
}
