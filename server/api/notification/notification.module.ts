import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '../../model/mongo/otp.model';
import { EmailHelper } from '../../util/email.helper';
import { SmsHelper } from '../../util/sms.helper';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [NotificationController],
  providers: [NotificationService, EmailHelper, SmsHelper],
  exports: [NotificationService],
})
export class NotificationModule {}
