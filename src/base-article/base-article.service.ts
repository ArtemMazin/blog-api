import mongoose, { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { InvalidIdFormatException } from 'src/errors/InvalidIdFormatException';
import { NotFoundArticleException } from 'src/errors/NotFoundArticleException';
import { NotFoundUserException } from 'src/errors/NotFoundUserException';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto';
import { BaseArticle } from 'src/schemas/base-article.schema';

@Injectable()
export abstract class BaseArticleService<T extends BaseArticle> {
  constructor(
    protected usersService: UsersService,
    protected articleModel: Model<T>,
    protected userModel: Model<User>,
  ) {}

  async createArticle(
    createArticleDto: any,
    userId: string,
    file: Express.Multer.File,
  ): Promise<T> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new InvalidIdFormatException();
    }

    try {
      const user = await this.userModel.findById(userId);

      if (user === null) {
        throw new NotFoundUserException();
      }

      if (createArticleDto.isPremium === 'true' && !user.isPremium) {
        throw new ForbiddenException(
          'Только премиум-пользователи могут создавать премиум-статьи',
        );
      }

      const createdArticle = new this.articleModel({
        ...createArticleDto,
        author: user,
        image: file ? file.filename : null,
        isPremium: createArticleDto.isPremium,
      });
      return createdArticle.save();
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(
    id: string,
    updateArticleDto: any,
    file?: Express.Multer.File,
  ): Promise<T> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const updateData: any = { ...updateArticleDto };

      if (file) {
        updateData.image = file.filename;
      }

      const existingArticle = await this.articleModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('author');

      if (!existingArticle) {
        throw new NotFoundArticleException();
      }

      return existingArticle;
    } catch (error) {
      throw error;
    }
  }

  async findOneArticle(id: string, userData?: ResponseUserDto): Promise<T> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const article = await this.articleModel
        .findById(id)
        .populate('author')
        .exec();

      if (!article) {
        throw new NotFoundArticleException();
      }

      if (article.isPremium) {
        await this.checkPremiumAccess(userData);
      }

      return article;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundArticleException();
    }
  }

  async findAllArticles(): Promise<T[]> {
    try {
      const articles = await this.articleModel.find().populate('author').exec();
      if (articles === null) {
        throw new NotFoundArticleException();
      }
      return articles;
    } catch (error) {
      throw new NotFoundArticleException();
    }
  }

  async deleteArticle(id: string): Promise<T> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const deletedArticle = await this.articleModel
        .findByIdAndDelete(id)
        .populate('author')
        .exec();

      if (deletedArticle === null) {
        throw new NotFoundArticleException();
      }

      await this.usersService.removeArticleFromAllFavorites(id);

      return deletedArticle;
    } catch (error) {
      throw error;
    }
  }

  async searchArticles(searchTerm: string): Promise<T[]> {
    const regex = new RegExp(searchTerm, 'i');

    return this.articleModel
      .find({
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      })
      .populate('author')
      .exec();
  }

  async getArticleAuthor(id: string): Promise<string> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const article = await this.articleModel.findById(id).lean();

      if (article === null) {
        throw new NotFoundArticleException();
      }

      return article?.author.toString();
    } catch (error) {
      throw error;
    }
  }

  async findMyAllArticles(userId: string): Promise<T[]> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new InvalidIdFormatException();
    }
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const myArticles = await this.articleModel
        .find({ author: objectId })
        .populate('author')
        .exec();

      if (myArticles === null) {
        throw new NotFoundArticleException();
      }

      return myArticles;
    } catch (error) {
      throw error;
    }
  }

  protected abstract checkPremiumAccess(
    userData?: ResponseUserDto,
  ): Promise<void>;
}
