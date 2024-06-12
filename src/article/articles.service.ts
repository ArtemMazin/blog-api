import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { ArticleDto } from './dto';
import { IArticle } from 'types/types';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}
  async createArticle(createArticleDto: ArticleDto): Promise<IArticle> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  async findOneArticle(id: string): Promise<IArticle> {
    return this.articleModel.findById(id).exec();
  }

  async findAllArticles(): Promise<IArticle[]> {
    return this.articleModel.find().exec();
  }

  async deleteArticle(id: string): Promise<IArticle> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  async updateArticle(
    id: string,
    updateArticleDto: ArticleDto,
  ): Promise<IArticle> {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto);
  }

  async searchArticles(searchTerm: string): Promise<IArticle[]> {
    const regex = new RegExp(searchTerm, 'i');

    return this.articleModel
      .find({
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      })
      .exec();
  }
}
