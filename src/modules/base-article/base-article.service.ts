import mongoose, { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { InvalidIdFormatException } from 'src/errors/InvalidIdFormatException';
import { BaseArticle } from 'src/schemas/base-article.schema';
import { calculateReadingTime } from 'src/common/constants';
import { CreateBaseArticleDto } from './dto/create-article.dto';
import { UpdateBaseArticleDto } from './dto/update-article.dto';
import { UsersService } from '../users/users.service';
import { ResponseUserDto } from '../users/dto';
import { IArticleService } from 'types/types';

@Injectable()
export abstract class BaseArticleService<
  T extends BaseArticle,
  CreateDto extends CreateBaseArticleDto,
  UpdateDto extends UpdateBaseArticleDto,
  ResponseDto,
> implements IArticleService
{
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected usersService: UsersService,
    protected articleModel: Model<T>,
    protected userModel: Model<User>,
  ) {}

  // Абстрактный метод для преобразования статьи в DTO ответа
  protected abstract toArticleResponse(article: T): ResponseDto;

  // Абстрактный метод для проверки премиум-доступа
  protected checkPremiumStatus(isPremium: string, user: ResponseUserDto): void {
    if (isPremium === 'true' && !user.isPremium) {
      throw new ForbiddenException(
        'Только премиум-пользователи могут создавать премиум-статьи',
      );
    }
  }

  // Создание новой статьи
  async createArticle(
    createArticleDto: CreateDto,
    user: ResponseUserDto,
    file: Express.Multer.File,
  ): Promise<ResponseDto> {
    this.logger.log(`Попытка создания новой статьи пользователем: ${user._id}`);

    try {
      this.checkPremiumStatus(createArticleDto.isPremium, user);

      const readingTime = calculateReadingTime(createArticleDto.content);

      const createdArticle = new this.articleModel({
        ...createArticleDto,
        author: user,
        image: file ? file.filename : null,
        isPremium: createArticleDto.isPremium === 'true',
        readingTime,
      });

      const savedArticle = await createdArticle.save();
      this.logger.log(`Статья успешно создана: ${savedArticle._id}`);
      return this.toArticleResponse(savedArticle);
    } catch (error) {
      this.logger.error(`Ошибка при создании статьи: ${error.message}`);
      throw error;
    }
  }

  // Обновление существующей статьи
  async updateArticle(
    id: string,
    user: ResponseUserDto,
    updateArticleDto: UpdateDto,
    file?: Express.Multer.File,
  ): Promise<ResponseDto> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    const existingArticle = await this.articleModel.findById(id);
    if (!existingArticle) {
      throw new NotFoundException(`Статья с ID ${id} не найдена`);
    }

    this.checkPremiumStatus(updateArticleDto.isPremium, user);

    const updateData = {
      ...existingArticle.toObject(),
      ...updateArticleDto,
      author: user,
      image: file ? file.filename : existingArticle.image,
      isPremium: updateArticleDto.isPremium === 'true',
      readingTime: updateArticleDto.content
        ? calculateReadingTime(updateArticleDto.content)
        : existingArticle.readingTime,
    };

    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('author');

    return this.toArticleResponse(updatedArticle);
  }

  // Получение одной статьи по ID
  async findOneArticle(
    id: string,
    userData?: ResponseUserDto,
  ): Promise<ResponseDto> {
    this.logger.log(`Поиск статьи по ID: ${id}`);

    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const article = await this.articleModel
        .findById(id)
        .populate('author')
        .exec();

      if (!article) {
        throw new NotFoundException(`Статья с ID ${id} не найдена`);
      }

      if (article.isPremium) {
        await this.checkPremiumAccess(userData);
      }

      return this.toArticleResponse(article);
    } catch (error) {
      this.logger.error(`Ошибка при поиске статьи: ${error.message}`);
      throw error;
    }
  }

  // Получение всех статей
  async findAllArticles(): Promise<ResponseDto[]> {
    this.logger.log('Поиск всех статей');

    try {
      const articles = await this.articleModel.find().populate('author').exec();
      return articles.map((article) => this.toArticleResponse(article));
    } catch (error) {
      this.logger.error(`Ошибка при поиске всех статей: ${error.message}`);
      throw error;
    }
  }

  // Получение всех статей пользователя
  async findMyAllArticles(userId: string): Promise<ResponseDto[]> {
    this.logger.log(`Поиск всех статей пользователя: ${userId}`);

    if (!mongoose.isValidObjectId(userId)) {
      throw new InvalidIdFormatException();
    }

    try {
      const myArticles = await this.articleModel
        .find({ 'author._id': userId })
        .populate('author')
        .exec();

      return myArticles.map((article) => this.toArticleResponse(article));
    } catch (error) {
      this.logger.error(
        `Ошибка при поиске статей пользователя: ${error.message}`,
      );
      throw error;
    }
  }

  // Удаление статьи
  async deleteArticle(id: string): Promise<ResponseDto> {
    const session = await this.articleModel.db.startSession();
    session.startTransaction();

    try {
      const deletedArticle = await this.articleModel
        .findByIdAndDelete(id)
        .populate('author')
        .session(session)
        .exec();

      if (!deletedArticle) {
        throw new NotFoundException(`Статья с ID ${id} не найдена`);
      }

      await this.usersService.removeArticleFromAllFavorites(id, session);

      await session.commitTransaction();
      this.logger.log(`Статья успешно удалена: ${id}`);
      return this.toArticleResponse(deletedArticle);
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Ошибка при удалении статьи: ${error.message}`);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Поиск статей
  async searchArticles(searchTerm: string): Promise<ResponseDto[]> {
    this.logger.log(`Поиск статей по запросу: ${searchTerm}`);

    const regex = new RegExp(searchTerm, 'i');

    try {
      const articles = await this.articleModel
        .find({
          $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
        })
        .populate('author')
        .exec();

      return articles.map((article) => this.toArticleResponse(article));
    } catch (error) {
      this.logger.error(`Ошибка при поиске статей: ${error.message}`);
      throw error;
    }
  }

  // Получение автора статьи
  async getArticleAuthor(id: string): Promise<string> {
    this.logger.log(`Получение автора статьи: ${id}`);

    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const article = await this.articleModel.findById(id);

      if (!article) {
        throw new NotFoundException(`Статья с ID ${id} не найдена`);
      }

      return article.author._id.toString();
    } catch (error) {
      this.logger.error(`Ошибка при получении автора статьи: ${error.message}`);
      throw error;
    }
  }

  // Абстрактный метод для проверки премиум-доступа
  protected abstract checkPremiumAccess(
    userData?: ResponseUserDto,
  ): Promise<void>;
}
