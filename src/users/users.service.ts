import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto';
import { IUserWithoutPassword } from 'types/types';
import { IncorrectDataException } from 'src/errors/IncorrectDataException';
import { NotFoundUserException } from 'src/errors/NotFoundUserException';
import { UserCreationFailedException } from 'src/errors/UserCreationFailedException';
import { avatarConfig } from 'src/config/multer.config';

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

  async findById(id: string): Promise<IUserWithoutPassword> {
    if (!id) {
      throw new IncorrectDataException();
    }
    try {
      return await this.userModel.findById(id).lean();
    } catch (error) {
      throw new NotFoundUserException();
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

  async addFavoriteArticle(userId: string, articleId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundUserException();
    }
    if (user.favorite_articles.includes(articleId)) {
      return user;
    }
    user.favorite_articles.push(articleId);
    return await user.save();
  }

  async removeFavoriteArticle(
    userId: string,
    articleId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundUserException();
    }
    user.favorite_articles = user.favorite_articles.filter(
      (favoriteArticleId) => favoriteArticleId !== articleId,
    );
    return await user.save();
  }

  async updateProfile(
    userId: string,
    updateProfileDto: Partial<User>,
    file?: Express.Multer.File,
  ): Promise<User> {
    const updateData: any = {
      ...updateProfileDto,
    };
    if (file) {
      updateData.avatar = `${avatarConfig.destination}${file.filename}`;
    }
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundUserException();
    }

    return await user.save();
  }
}
