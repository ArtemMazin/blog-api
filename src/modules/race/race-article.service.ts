import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    @InjectModel(RaceArticle.name)
    raceArticleModel: Model<RaceArticle>,
    @InjectModel(User.name) userModel: Model<User>,
    usersService: UsersService,
  ) {
    super(usersService, raceArticleModel, userModel);
  }

  // Реализация метода преобразования статьи в DTO ответа
  protected toArticleResponse(article: RaceArticle): ResponseRaceArticleDto {
    return plainToClass(ResponseRaceArticleDto, article.toObject(), {
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

  protected prepareArticleData(
    createArticleDto: CreateRaceArticleDto,
    user: ResponseUserDto,
    file: Express.Multer.File,
  ): Partial<RaceArticle> {
    const baseData = super.prepareArticleData(createArticleDto, user, file);

    const distinctiveFeatures = createArticleDto.distinctiveFeatures
      ? createArticleDto.distinctiveFeatures
          .split(',')
          .map((item) => item.trim())
      : [];

    const knownRepresentatives = createArticleDto.knownRepresentatives
      ? createArticleDto.knownRepresentatives
          .split(',')
          .map((item) => item.trim())
      : [];

    return {
      ...baseData,
      distinctiveFeatures,
      knownRepresentatives,
    };
  }

  protected prepareUpdateData(
    existingArticle: RaceArticle,
    updateArticleDto: UpdateRaceArticleDto,
    user: ResponseUserDto,
    file?: Express.Multer.File,
  ): Partial<RaceArticle> {
    const baseData = super.prepareUpdateData(
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

    const knownRepresentatives = updateArticleDto.knownRepresentatives
      ? updateArticleDto.knownRepresentatives
          .split(',')
          .map((item) => item.trim())
      : [];

    return {
      ...baseData,
      distinctiveFeatures,
      knownRepresentatives,
    };
  }
}
