import mongoose, { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { IArticle } from 'types/types';
import { User } from 'src/schemas/user.schema';
import { InvalidIdFormatException } from 'src/errors/InvalidIdFormatException';
import { NotFoundArticleException } from 'src/errors/NotFoundArticleException';
import { NotFoundUserException } from 'src/errors/NotFoundUserException';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto';
import { ArticleDto, ResponseArticleDto } from 'src/base-article/dto';

@Injectable()
export class ArticleService {
  constructor(
    private usersService: UsersService,
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
    updateArticleDto: Partial<ArticleDto>,
    file?: Express.Multer.File,
  ): Promise<ResponseArticleDto> {
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

      return existingArticle.toObject();
    } catch (error) {
      throw error;
    }
  }

  async findOneArticle(
    id: string,
    userData?: ResponseUserDto,
  ): Promise<ResponseArticleDto> {
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

      // Проверка доступа к премиум-статье
      if (!!article.isPremium) {
        await this.checkPremiumAccess(userData);
      }

      return article.toObject();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundArticleException();
    }
  }

  private async checkPremiumAccess(userData?: ResponseUserDto): Promise<void> {
    if (!userData) {
      throw new ForbiddenException(
        'Эта статья доступна только для премиум-пользователей',
      );
    }

    const user = await this.userModel.findById(userData._id).lean().exec();

    if (!user || !user.isPremium) {
      throw new ForbiddenException(
        'Эта статья доступна только для премиум-пользователей',
      );
    }
  }

  async findAllArticles(): Promise<ResponseArticleDto[]> {
    try {
      const articles = this.articleModel.find().populate('author').exec();
      if (articles === null) {
        throw new NotFoundArticleException();
      }
      return (await articles).map((article) => {
        return {
          ...article.toObject(),
          author: article.author.toObject(),
        };
      });
    } catch (error) {
      throw new NotFoundArticleException();
    }
  }

  async deleteArticle(id: string): Promise<ResponseArticleDto> {
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

      // Удаляем статью из избранного у всех пользователей
      await this.usersService.removeArticleFromAllFavorites(id);

      return deletedArticle.toObject();
    } catch (error) {
      throw error;
    }
  }

  async searchArticles(searchTerm: string): Promise<ResponseArticleDto[]> {
    const regex = new RegExp(searchTerm, 'i');

    const articles = await this.articleModel
      .find({
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      })
      .populate('author')
      .exec();

    return articles.map((article) => {
      return {
        ...article.toObject(),
        author: article.author.toObject(),
      };
    });
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

  async findMyAllArticles(userId: string): Promise<ResponseArticleDto[]> {
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

      return myArticles.map((article) => {
        return {
          ...article.toObject(),
          author: article.author.toObject(),
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
