import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseArticleService } from 'src/base-article/base-article.service';
import { CharacterArticle } from 'src/schemas/character.schema';
import { User } from 'src/schemas/user.schema';
import { BaseArticle } from 'src/schemas/base-article.schema';
import { ResponseUserDto } from 'src/users/dto';

@Injectable()
export class CharacterArticleService extends BaseArticleService<CharacterArticle> {
  constructor(
    @InjectModel(BaseArticle.name)
    characterArticleModel: Model<CharacterArticle>,
    @InjectModel(User.name) userModel: Model<User>,
    usersService: UsersService,
  ) {
    super(usersService, characterArticleModel, userModel);
  }

  protected async checkPremiumAccess(
    userData?: ResponseUserDto,
  ): Promise<void> {
    if (!userData) {
      throw new ForbiddenException(
        'Эта статья доступна только для премиум-пользователей',
      );
    }

    const user = await this.userModel.findById(userData._id).lean().exec();

    if (!user || !user.isPremium) {
      throw new ForbiddenException(
        'Эта статья доступна только для премиум-пользователей',
      );
    }
  }
}
