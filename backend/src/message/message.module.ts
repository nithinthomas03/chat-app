import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message, MessageSchema } from '../schema/message.schema';
import { Conversation, ConversationSchema } from '../schema/conversation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
