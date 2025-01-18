import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthDto, CreateUserDto } from './dto';
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: CreateUserDto) {
    try {
      // check if user already exists
      const userFound = await this.userModel.findOne({ email: dto.email });
      if (userFound) {
        throw new Error('User Already Exists');
      }

      // generate the password hash
      const hash = await argon2.hash(dto.password);

      // save the user to the database
      const newUser = new this.userModel({
        ...dto,
        password: hash,
      });
      const savedUser = await newUser.save();
      const userObj = savedUser.toObject({ versionKey: false });

      // generate a JWT token
      const token = await this.signToken(userObj._id.toString(), userObj.email);

      delete userObj.password;
      delete userObj._id;
      return {
        user: userObj,
        token,
      };
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async login(dto: AuthDto) {
    try {
      // find user by email
      const userFound = await this.userModel.findOne({ email: dto.email });
      if (!userFound) {
        throw new Error('User Not Found');
      }

      //compare password
      const isPasswordValid = await argon2.verify(
        userFound.password,
        dto.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid Credentials');
      }

      // generate a JWT token
      const userObj = userFound.toObject({ versionKey: false });
      const token = await this.signToken(userObj._id.toString(), userObj.email);
      delete userObj.password;
      delete userObj._id;
      return {
        user: userObj,
        token,
      };
    } catch (err: any) {
      throw new Error(err);
    }
  }

  logout() {
    return 'Logged out successfully';
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return token;
  }
}
