import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { BaseArticleService } from 'src/modules/base-article/base-article.service';
import { RaceArticle } from 'src/schemas/race-article.schema';
import { User } from 'src/schemas/user.schema';
import { InvalidPremiumStatus } from 'src/errors/InvalidPremiumStatus';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from '../users/dto';
import {
  CreateRaceArticleDto,
  ResponseRaceArticleDto,
  UpdateRaceArticleDto,
} from './dto';
import { IArticleService } from 'types/types';
import { CharacterArticle } from 'src/schemas/character-article.schema';

@Injectable()
export class RaceArticleService
  extends BaseArticleService<
    RaceArticle,
    CreateRaceArticleDto,
    UpdateRaceArticleDto,
    ResponseRaceArticleDto
  >
  implements IArticleService
{
  constructor(
    @InjectModel(RaceArticle.name) raceArticleModel: Model<RaceArticle>,
    @InjectModel(User.name) userModel: Model<User>,
    usersService: UsersService,
    @InjectModel(CharacterArticle.name)
    private characterArticleModel: Model<CharacterArticle>,
  ) {
    super(usersService, raceArticleModel, userModel);
  }

  // Преобразование статьи в DTO ответа
  protected toArticleResponse(article: RaceArticle): ResponseRaceArticleDto {
    return plainToClass(ResponseRaceArticleDto, article.toObject(), {
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

  // Подготовка данных статьи
  protected async prepareArticleData(
    createArticleDto: CreateRaceArticleDto,
    user: ResponseUserDto,
    file: Express.Multer.File,
  ): Promise<Partial<RaceArticle>> {
    const baseData = await super.prepareArticleData(
      createArticleDto,
      user,
      file,
    );

    const distinctiveFeatures = createArticleDto.distinctiveFeatures
      ? createArticleDto.distinctiveFeatures
          .split(',')
          .map((item) => item.trim())
      : [];

    const knownRepresentatives = await this.processKnownRepresentatives(
      createArticleDto.knownRepresentatives,
    );

    return {
      ...baseData,
      distinctiveFeatures,
      knownRepresentatives,
    };
  }

  // Подготовка данных для обновления
  protected async prepareUpdateData(
    existingArticle: RaceArticle,
    updateArticleDto: UpdateRaceArticleDto,
    user: ResponseUserDto,
    file?: Express.Multer.File,
  ): Promise<Partial<RaceArticle>> {
    const baseData = await super.prepareUpdateData(
      existingArticle,
      updateArticleDto,
      user,
      file,
    );

    const distinctiveFeatures = updateArticleDto.distinctiveFeatures
      ? updateArticleDto.distinctiveFeatures
          .split(',')
          .map((item) => item.trim())
      : existingArticle.distinctiveFeatures;

    const knownRepresentatives = await this.processKnownRepresentatives(
      updateArticleDto.knownRepresentatives,
      existingArticle.knownRepresentatives,
    );

    return {
      ...baseData,
      distinctiveFeatures,
      knownRepresentatives,
    };
  }

  // Обработка известных представителей
  private async processKnownRepresentatives(
    newRepresentatives?: string,
    existingRepresentatives?: { _id: Types.ObjectId; name: string }[],
  ): Promise<{ _id: Types.ObjectId; name: string }[]> {
    if (!newRepresentatives) {
      return existingRepresentatives || [];
    }

    const representativeIds = newRepresentatives
      .split(',')
      .map((id) => id.trim());
    const processedRepresentatives = [];

    for (const id of representativeIds) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Некорректный ID персонажа: ${id}`);
      }

      const character = await this.characterArticleModel.findById(id);
      if (!character) {
        throw new BadRequestException(`Персонаж с ID ${id} не найден`);
      }

      processedRepresentatives.push({
        _id: new Types.ObjectId(id),
        name: character.characterName,
      });
    }

    return processedRepresentatives;
  }
}
