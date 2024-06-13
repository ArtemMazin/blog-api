import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { ArticleDto } from './dto';
import { IArticle } from 'types/types';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async createArticle(createArticleDto: ArticleDto, userId: string) {
    const user = await this.userModel.findById(userId);

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      author: user,
    });
    return createdArticle.save();
  }

  async findOneArticle(id: string): Promise<IArticle> {
    return this.articleModel.findById(id).populate('author').exec();
  }

  async findAllArticles(): Promise<IArticle[]> {
    return this.articleModel.find().populate('author').exec();
  }

  async deleteArticle(id: string): Promise<IArticle> {
    return this.articleModel.findByIdAndDelete(id).populate('author').exec();
  }

  async updateArticle(
    id: string,
    updateArticleDto: ArticleDto,
  ): Promise<IArticle> {
    return this.articleModel
      .findByIdAndUpdate(id, updateArticleDto)
      .populate('author')
      .exec();
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
}
