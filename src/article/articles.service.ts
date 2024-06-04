import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { ArticleDto } from 'src/dto/article.dto';
import IArticle from 'types/article';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}
  async create(createArticleDto: ArticleDto): Promise<IArticle> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }
  async findAll(): Promise<IArticle[]> {
    return this.articleModel.find().exec();
  }
}
