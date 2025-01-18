import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { AccessTokenPayloadDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<AccessTokenPayloadDto> {
    try {
        const userFound = await this.userModel.findById(payload.sub);
        if (!userFound) {
            throw new Error('User Not Found');
        }
        return { sub: payload.sub, email: payload.email };
    }
    catch(error){
        console.log("Error in JwtStrategy.validate: ", error);
    }
  }

}
