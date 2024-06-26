import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto';
import { IUserWithoutPassword } from 'types/types';
import { IncorrectDataException } from 'src/errors/IncorrectDataException';
import { NotFoundUserException } from 'src/errors/NotFoundUserException';
import { UserCreationFailedException } from 'src/errors/UserCreationFailedException';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: SignUpDto): Promise<IUserWithoutPassword> {
    if (!user.email || !user.password || !user.name) {
      throw new IncorrectDataException();
    }
    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw new UserCreationFailedException();
    }
  }

  async findByEmail(email: string): Promise<IUserWithoutPassword> {
    if (!email) {
      throw new IncorrectDataException();
    }
    try {
      return await this.userModel.findOne({ email }).lean();
    } catch (error) {
      throw new NotFoundUserException();
    }
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    if (!email) {
      throw new IncorrectDataException();
    }
    try {
      return await this.userModel.findOne({ email }).select('+password').lean();
    } catch (error) {
      throw new NotFoundUserException();
    }
  }
}
