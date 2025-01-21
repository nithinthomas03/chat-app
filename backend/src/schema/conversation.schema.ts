import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  participants: [Types.ObjectId];

  @Prop({ type: Types.ObjectId, ref: 'Message', required: true, default: [] })
  messages: [Types.ObjectId];
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
