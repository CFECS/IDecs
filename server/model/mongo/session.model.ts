import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { config } from '../../../config';

@Schema()
export class Session extends Document {
  @Prop({ unique: true })
  sessionId!: string;

  @Prop()
  profile!: Record<string, any>;

  @Prop({ default: Date.now, expires: config.sessionExpire })
  createdAt?: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
