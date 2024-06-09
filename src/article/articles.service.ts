import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import IArticle from 'types/article';
import { ArticleDto } from './dto';

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
}
