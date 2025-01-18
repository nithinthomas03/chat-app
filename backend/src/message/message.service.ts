import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto';

@Injectable()
export class MessageService {
  async getMessages(userId: string) {
    return `Fetching messages for user ${userId}`;
  }

  async sendMessage(message: MessageDto) {
    return 'Sending message';
  }
}
