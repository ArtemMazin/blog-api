import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

    return {
      ...baseData,
      characterName: createArticleDto.characterName,
      birthDate: createArticleDto.birthDate,
      deathDate: createArticleDto.deathDate,
      gender: createArticleDto.gender,
      height: createArticleDto.height,
      homeWorld: createArticleDto.homeWorld,
    };
  }

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

    return {
      ...baseData,
      characterName:
        updateArticleDto.characterName ?? existingArticle.characterName,
      birthDate: updateArticleDto.birthDate ?? existingArticle.birthDate,
      deathDate: updateArticleDto.deathDate ?? existingArticle.deathDate,
      gender: updateArticleDto.gender ?? existingArticle.gender,
      height: updateArticleDto.height ?? existingArticle.height,
      homeWorld: updateArticleDto.homeWorld ?? existingArticle.homeWorld,
    };
  }

  async setRaceForCharacter(
    articleId: string,
    raceId: string,
  ): Promise<ResponseCharacterArticleDto> {
    if (!isValidObjectId(articleId) || !isValidObjectId(raceId)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const race = await this.raceArticleModel.findById(raceId);
    if (!race) {
      throw new NotFoundException(`Раса с ID ${raceId} не найдена`);
    }

    const updateData = {
      race: {
        _id: race._id,
        raceName: race.raceName,
      },
    };

    const article = await this.articleModel
      .findByIdAndUpdate(articleId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate('author');

    if (!article) {
      throw new NotFoundException(`Статья с ID ${articleId} не найдена`);
    }

    return this.toArticleResponse(article);
  }

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
