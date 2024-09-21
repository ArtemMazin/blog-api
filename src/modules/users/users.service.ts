import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { IncorrectDataException } from 'src/errors/IncorrectDataException';
import { ResponseUserDto } from './dto';
import { RegisterDto } from 'src/modules/auth/dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private toUserResponse(user: User): ResponseUserDto {
    return plainToClass(ResponseUserDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    return user;
  }

  async createUser(user: RegisterDto): Promise<ResponseUserDto> {
    this.logger.log(`Попытка создания нового пользователя: ${user.email}`);

    try {
      const newUser = await this.userModel.create(user);
      this.logger.log(`Пользователь успешно создан: ${newUser.email}`);
      return this.toUserResponse(newUser);
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn(
          `Попытка создания дубликата пользователя: ${user.email}`,
        );
        throw new ConflictException(
          'Пользователь с таким email или username уже существует',
        );
      }
      this.logger.error(`Ошибка при создании пользователя: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    this.logger.log('Получение всех пользователей');
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toUserResponse(user));
  }

  async findById(id: string): Promise<ResponseUserDto> {
    this.logger.log(`Поиск пользователя по ID: ${id}`);
    if (!id) {
      throw new IncorrectDataException();
    }
    const user = await this.findUserById(id);
    return this.toUserResponse(user);
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    this.logger.log(`Поиск пользователя по email: ${email}`);
    if (!email) {
      throw new IncorrectDataException();
    }
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Пользователь с email ${email} не найден`);
    }
    return this.toUserResponse(user);
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    this.logger.log(`Поиск пользователя по email с паролем: ${email}`);
    if (!email) {
      throw new IncorrectDataException();
    }
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Пользователь с email ${email} не найден`);
    }
    return user;
  }

  async addFavoriteArticle(
    userId: string,
    articleId: string,
  ): Promise<ResponseUserDto> {
    this.logger.log(
      `Добавление статьи ${articleId} в избранное пользователя ${userId}`,
    );
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favorite_articles: articleId } },
        { new: true },
      )
      .exec();
    return this.toUserResponse(updatedUser);
  }

  async removeFavoriteArticle(
    userId: string,
    articleId: string,
  ): Promise<ResponseUserDto> {
    this.logger.log(
      `Удаление статьи ${articleId} из избранного пользователя ${userId}`,
    );
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favorite_articles: articleId } },
        { new: true },
      )
      .exec();
    return this.toUserResponse(updatedUser);
  }

  async removeArticleFromAllFavorites(articleId: string): Promise<void> {
    await this.userModel.updateMany(
      { favoriteArticles: articleId },
      { $pull: { favoriteArticles: articleId } },
    );
  }

  async updateProfile(
    userId: string,
    updateProfileDto: Partial<User>,
    file?: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    this.logger.log(`Обновление профиля пользователя: ${userId}`);
    const updateData: Partial<User> = { ...updateProfileDto };
    if (file) {
      updateData.avatar = file.filename;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    this.logger.log(`Профиль пользователя ${userId} успешно обновлен`);
    return this.toUserResponse(updatedUser);
  }
}
