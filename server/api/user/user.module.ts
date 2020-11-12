import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../../model/rds/user.model';
import { Session, SessionSchema } from '../../model/mongo/session.model';
import { JwtUtil } from '../../util/jwt.util';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtUtil],
  exports: [JwtUtil],
})
export class UserModule {}
