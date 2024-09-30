import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CharacterArticle } from 'src/schemas/character-article.schema';
import { User } from 'src/schemas/user.schema';
import { plainToClass } from 'class-transformer';
import { ResponseUserCollectionDto } from './dto';
import { ResponseRollCharacterDto } from './dto/response-roll-character.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserCollection } from 'src/schemas/user-collection.schema';

@Injectable()
export class UserCollectionService {
  private readonly logger = new Logger(UserCollectionService.name);

  constructor(
    @InjectModel(UserCollection.name)
    private readonly userCollectionModel: Model<UserCollection>,
    @InjectModel(CharacterArticle.name)
    private readonly characterArticleModel: Model<CharacterArticle>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private toUserCollectionResponse(
    userCollection: UserCollection,
  ): ResponseUserCollectionDto {
    return plainToClass(ResponseUserCollectionDto, userCollection.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async initializeCollection(userId: string): Promise<void> {
    this.logger.log(`Инициализация коллекции для пользователя: ${userId}`);
    try {
      const newCollection = new this.userCollectionModel({
        user: userId,
        characters: [],
        rollsToday: 0,
        lastRollDate: new Date(),
      });
      await newCollection.save();
      this.logger.log(`Коллекция успешно создана для пользователя: ${userId}`);
    } catch (error) {
      this.logger.error(`Ошибка при создании коллекции: ${error.message}`);
      throw new Error('Не удалось создать коллекцию для пользователя');
    }
  }

  private async findUserCollectionById(
    userId: string,
  ): Promise<UserCollection> {
    const userCollection = await this.userCollectionModel
      .findOne({ user: userId })
      .exec();
    if (!userCollection) {
      throw new NotFoundException(
        `Коллекция пользователя с ID ${userId} не найдена`,
      );
    }
    return userCollection;
  }

  async getUserCollection(userId: string): Promise<ResponseUserCollectionDto> {
    this.logger.log(`Получение коллекции пользователя: ${userId}`);
    const userCollection = await this.findUserCollectionById(userId);

    return this.toUserCollectionResponse(userCollection);
  }

  async rollCharacter(userId: string): Promise<ResponseRollCharacterDto> {
    this.logger.log(
      `Попытка получения случайного персонажа для пользователя: ${userId}`,
    );

    const userCollection = await this.findUserCollectionById(userId);
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    const maxRolls = user.isPremium ? 10 : 5;

    if (userCollection.rollsToday >= maxRolls) {
      throw new BadRequestException('Достигнут лимит попыток на сегодня');
    }

    // Получаем случайного персонажа из всех существующих
    const character = await this.characterArticleModel
      .aggregate([{ $sample: { size: 1 } }])
      .exec();

    if (!character || character.length === 0) {
      throw new NotFoundException('Персонаж не найден');
    }

    const isNew = !userCollection.characters.includes(character[0]._id);
    if (isNew) {
      userCollection.characters.push(character[0]._id);
    }

    userCollection.rollsToday += 1;
    userCollection.lastRollDate = new Date();
    await userCollection.save();

    return plainToClass(
      ResponseRollCharacterDto,
      {
        character: character[0],
        isNew,
        remainingRolls: maxRolls - userCollection.rollsToday,
      },
      { excludeExtraneousValues: true },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReset() {
    this.logger.log('Запуск ежедневного сброса попыток');
    await this.resetDailyRolls();
  }

  async resetDailyRolls(): Promise<void> {
    this.logger.log('Сброс ежедневных попыток для всех пользователей');
    await this.userCollectionModel
      .updateMany({}, { $set: { rollsToday: 0 } })
      .exec();
  }
}
