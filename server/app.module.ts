import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { GlobalModule } from './module/global.module';
import { GatewayMiddleware } from './middleware/gateway.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config.database, entities: [`${__dirname}/model/rds/*.ts`] }),
    MongooseModule.forRoot(config.mongoDB.uri, { useCreateIndex: true }),
    GlobalModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GatewayMiddleware).forRoutes('*');
  }
}
