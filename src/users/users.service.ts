import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto';
import { IUserWithoutPassword } from 'types/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: SignUpDto): Promise<IUserWithoutPassword> {
    return await this.userModel.create(user);
  }

  async findByEmail(email: string): Promise<IUserWithoutPassword> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password').lean();
  }
}
