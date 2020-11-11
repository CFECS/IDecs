import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Session extends Document {
  @Prop({ unique: true })
  sessionId!: string;

  @Prop()
  profile!: Record<string, any>;

  @Prop({ default: Date.now, expires: '1d' })
  createdAt?: Date;
}

export type CatDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
