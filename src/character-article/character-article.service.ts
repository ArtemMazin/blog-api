import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { BaseArticleService } from 'src/base-article/base-article.service';
import { CharacterArticle } from 'src/schemas/character.schema';
import { User } from 'src/schemas/user.schema';
import { BaseArticle } from 'src/schemas/base-article.schema';

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
}
