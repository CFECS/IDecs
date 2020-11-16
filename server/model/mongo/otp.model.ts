import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { config } from '../../../config';

@Schema()
export class Otp extends Document {
  @Prop()
  type!: string;

  @Prop()
  code!: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  seq!: number;

  @Prop({ default: Date.now, expires: config.expire.otp })
  updatedAt?: Date;
}

export type OtpDocument = Otp & Document;
export const OtpSchema = SchemaFactory.createForClass(Otp);
