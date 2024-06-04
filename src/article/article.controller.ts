import { Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from './articles.service';
import IArticle from 'types/article';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('get-articles')
  async getAllArticles(): Promise<IArticle[]> {
    return this.service.findAllArticles();
  }

  @Post('create-article')
  async createArticle(createArticleDto: IArticle): Promise<IArticle> {
    return this.service.createArticle(createArticleDto);
  }
}
