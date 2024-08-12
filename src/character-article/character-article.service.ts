import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { BaseArticleService } from 'src/base-article/base-article.service';
import { CharacterArticle } from 'src/schemas/character.schema';
import { User } from 'src/schemas/user.schema';
import { InvalidPremiumStatus } from 'src/errors/InvalidPremiumStatus';
import { CreateCharacterArticleDto } from './dto/create-character-article.dto';
import { UpdateCharacterArticleDto } from './dto/update-character-article.dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';

@Injectable()
export class CharacterArticleService extends BaseArticleService<
  CharacterArticle,
  CreateCharacterArticleDto,
  UpdateCharacterArticleDto
> {
  constructor(
    @InjectModel(CharacterArticle.name)
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
      throw new InvalidPremiumStatus();
    }

    const user = await this.userModel.findById(userData._id).lean().exec();

    if (!user || !user.isPremium) {
      throw new InvalidPremiumStatus();
    }
  }
}
