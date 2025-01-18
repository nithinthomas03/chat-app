import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.signup(createUserDto);
    response.cookie('access_token', token, { httpOnly: true });
    return user;
  }

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.login(authDto);
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true, // set to true if using https
      sameSite: 'strict',
    });
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', {
      maxAge: 0,
    });
    return this.authService.logout();
  }
}
