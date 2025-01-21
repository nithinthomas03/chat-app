import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto';
import { Conversation } from 'src/schema/conversation.schema';
import { Message } from 'src/schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  async getMessages(recipientId: string, userId: string) {

    // Add a check to validate the userId

    // Find all the conversations where the user is a participant
    const conversations = await this.conversationModel.find({
      participants: userId, recipientId
    }).populate('messages');

    return `Fetching messages for user ${userId}`;
  }

  async sendMessage(message: MessageDto): Promise<Message> {

    // Add a check to validate the senderId and receiverId

    // Extract the senderId, receiverId, and content from the message
    const { senderId, receiverId, content } = message;
    const newMessage = new this.messageModel({
      senderId,
      receiverId,
      content
    });

    // Find if a conversation exists between the sender and receiver
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [message.senderId, message.receiverId] },
    });

    // If it exists, add the message to the conversation
    if (conversation) {
      conversation.messages.push(newMessage._id as any as Types.ObjectId);
    }
    // If it doesn't exist, create a new conversation and add the message to it
    else {
      conversation = new this.conversationModel({
        participants: [message.senderId, message.receiverId],
        messages: [newMessage._id as any as Types.ObjectId],
      });
    }

    // Save the conversation and the message in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    return newMessage;
  }
}
