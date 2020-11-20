import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '../../model/mongo/session.model';
import { JwtUtil } from '../../util/jwt.util';
import { NotificationModule } from '../notification/notification.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [NotificationModule, MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  controllers: [UserController],
  providers: [UserService, JwtUtil],
  exports: [UserService, JwtUtil],
})
export class UserModule {}
