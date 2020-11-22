import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { config } from '../../../config';

@Schema()
export class Session extends Document {
  @Prop({ unique: true })
  sessionId!: string;

  @Prop()
  userId!: number;

  @Prop()
  auths!: Record<string, any>;

  @Prop()
  token!: string;

  @Prop({ default: Date.now, expires: config.expire.session })
  createdAt?: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
