import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './articles.service';
import IArticle from 'types/article';
import { ApiOkResponse } from '@nestjs/swagger';
import { ArticleDto } from 'src/dto/article.dto';
import { FindOneParams } from 'src/params/article-param';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('get-articles')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getAllArticles(): Promise<IArticle[]> {
    return this.service.findAllArticles();
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleDto })
  findOne(@Param() params: FindOneParams): Promise<IArticle> {
    return this.service.findOneArticle(params.id);
  }

  @Post('create-article')
  async createArticle(@Body() createArticleDto: ArticleDto): Promise<IArticle> {
    return this.service.createArticle(createArticleDto);
  }
}
