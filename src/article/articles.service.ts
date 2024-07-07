import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { ArticleDto, UpdateArticleDto } from './dto';
import { IArticle } from 'types/types';
import { User } from 'src/schemas/user.schema';
import { InvalidIdFormatException } from 'src/errors/InvalidIdFormatException';
import { NotFoundArticleException } from 'src/errors/NotFoundArticleException';
import { NotFoundUserException } from 'src/errors/NotFoundUserException';
import { multerConfig } from 'src/config/multer.config';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createArticle(
    createArticleDto: ArticleDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<IArticle> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new InvalidIdFormatException();
    }

    try {
      const user = await this.userModel.findById(userId);

      if (user === null) {
        throw new NotFoundUserException();
      }

      const createdArticle = new this.articleModel({
        ...createArticleDto,
        author: user,
        image: file ? `${multerConfig.destination}${file.filename}` : null,
      });
      return createdArticle.save();
    } catch (error) {
      throw error;
    }
  }

  async findOneArticle(id: string): Promise<IArticle> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const article = await this.articleModel
        .findById(id)
        .populate('author')
        .exec();
      if (article === null) {
        throw new NotFoundArticleException();
      }
      return article;
    } catch (error) {
      throw new NotFoundArticleException();
    }
  }

  async findAllArticles(): Promise<IArticle[]> {
    try {
      const articles = this.articleModel.find().populate('author').exec();
      if (articles === null) {
        throw new NotFoundArticleException();
      }
      return articles;
    } catch (error) {
      throw new NotFoundArticleException();
    }
  }

  async deleteArticle(id: string): Promise<IArticle> {
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
      return deletedArticle;
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<IArticle> {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidIdFormatException();
    }

    try {
      const existingArticle = this.articleModel
        .findByIdAndUpdate(id, updateArticleDto, {
          new: true,
        })
        .populate('author');

      if (existingArticle === null) {
        throw new NotFoundArticleException();
      }
      return existingArticle;
    } catch (error) {
      throw error;
    }
  }

  async searchArticles(searchTerm: string): Promise<IArticle[]> {
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
}
