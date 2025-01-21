import { Injectable } from "@nestjs/common";
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async getUsers(userId: string) {
        // Return all users and excludes the password field
        let users = await this.userModel.find({},{password: 0});
        return users;
    }
}