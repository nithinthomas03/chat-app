import { Controller, Post, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { AccessTokenPayloadDto } from 'src/auth/dto';
import { MessageDto } from './dto';

@UseGuards(AuthGuard('jwt')) // move this to auth folder so that this can be referenced by other controllers
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get(':id')
  async getMessages(@Param('id') userId: string, @GetUser() user: AccessTokenPayloadDto) {
    if (user.sub !== userId) {
      return 'You are not authorized to view this user\'s messages';
    } else {
        return await this.messageService.getMessages(userId);
    }
  }

  @Post()
  async sendMessage(@Body() messageDto: MessageDto, @GetUser() user: AccessTokenPayloadDto) {
    return this.messageService.sendMessage(messageDto);
  }
}
