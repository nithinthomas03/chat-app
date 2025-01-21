import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { AccessTokenPayloadDto } from 'src/auth/dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt')) // move this to auth folder so that this can be referenced by other controllers
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('all')
  async getUsers(@GetUser() user: AccessTokenPayloadDto) {
        return await this.userService.getUsers(user.sub);
  }
}
