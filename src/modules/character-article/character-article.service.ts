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
import { NotFoundException } from '@nestjs/common';
import { RaceArticle } from 'src/schemas/race-article.schema';

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
    @InjectModel(RaceArticle.name) private raceArticleModel: Model<RaceArticle>,
    usersService: UsersService,
  ) {
    super(usersService, characterArticleModel, userModel);
  }

  // Подготовка данных статьи при создании
  protected async prepareArticleData(
    createArticleDto: CreateCharacterArticleDto,
    user: ResponseUserDto,
    file: Express.Multer.File,
  ): Promise<Partial<CharacterArticle>> {
    const baseData = await super.prepareArticleData(
      createArticleDto,
      user,
      file,
    );
    const raceData = await this.getRaceData(createArticleDto.race);

    return {
      ...baseData,
      race: raceData,
    };
  }

  // Подготовка данных статьи при обновлении
  protected async prepareUpdateData(
    existingArticle: CharacterArticle,
    updateArticleDto: UpdateCharacterArticleDto,
    user: ResponseUserDto,
    file?: Express.Multer.File,
  ): Promise<Partial<CharacterArticle>> {
    const baseData = await super.prepareUpdateData(
      existingArticle,
      updateArticleDto,
      user,
      file,
    );
    const raceData = await this.getRaceData(updateArticleDto.race);

    return {
      ...baseData,
      race: raceData || existingArticle.race,
    };
  }

  // Получение данных о расе
  private async getRaceData(
    raceId: string | undefined,
  ): Promise<{ _id: string; raceName: string } | null> {
    if (!raceId) return null;
    const race = await this.raceArticleModel.findById(raceId);
    return race ? { _id: race._id.toString(), raceName: race.raceName } : null;
  }

  // Поиск статей по расе
  async findArticlesByRace(
    raceId: string,
  ): Promise<ResponseCharacterArticleDto[]> {
    const race = await this.raceArticleModel.findById(raceId);
    if (!race) {
      throw new NotFoundException(`Раса с ID ${raceId} не найдена`);
    }

    const articles = await this.articleModel
      .find({ race: raceId })
      .populate('author')
      .exec();
    return articles.map((article) => this.toArticleResponse(article));
  }

  // Преобразование статьи в DTO ответа
  protected toArticleResponse(
    article: CharacterArticle,
  ): ResponseCharacterArticleDto {
    return plainToClass(ResponseCharacterArticleDto, article.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  // Проверка премиум-доступа
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
