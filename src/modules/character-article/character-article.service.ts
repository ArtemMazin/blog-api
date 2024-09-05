import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { BaseArticleService } from 'src/modules/base-article/base-article.service';
import { CharacterArticle } from 'src/schemas/character-article.schema';
import { User } from 'src/schemas/user.schema';
import { InvalidPremiumStatus } from 'src/errors/InvalidPremiumStatus';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from '../users/dto';
import { IArticleService } from 'types/types';
import {
  CreateCharacterArticleDto,
  UpdateCharacterArticleDto,
  ResponseCharacterArticleDto,
} from './dto';

export class CharacterArticleService
  extends BaseArticleService<
    CharacterArticle,
    CreateCharacterArticleDto,
    UpdateCharacterArticleDto,
    ResponseCharacterArticleDto
  >
  implements IArticleService
{
  constructor(
    @InjectModel(CharacterArticle.name)
    characterArticleModel: Model<CharacterArticle>,
    @InjectModel(User.name) userModel: Model<User>,
    usersService: UsersService,
  ) {
    super(usersService, characterArticleModel, userModel);
  }

  // Реализация метода преобразования статьи в DTO ответа
  protected toArticleResponse(
    article: CharacterArticle,
  ): ResponseCharacterArticleDto {
    return plainToClass(ResponseCharacterArticleDto, article.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  // Реализация метода проверки премиум-доступа
  protected async checkPremiumAccess(
    userData?: ResponseUserDto,
  ): Promise<void> {
    this.logger.log(
      `Проверка премиум-доступа для пользователя: ${userData?._id}`,
    );

    if (!userData) {
      throw new InvalidPremiumStatus();
    }

    const user = await this.userModel.findById(userData._id).lean().exec();

    if (!user || !user.isPremium) {
      this.logger.warn(
        `Отказано в премиум-доступе пользователю: ${userData._id}`,
      );
      throw new InvalidPremiumStatus();
    }

    this.logger.log(
      `Премиум-доступ подтвержден для пользователя: ${userData._id}`,
    );
  }
}
