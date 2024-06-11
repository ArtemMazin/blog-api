import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ArticleDto } from './dto';
import { IArticle } from 'types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('article')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('all')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getAllArticles(): Promise<IArticle[]> {
    return this.service.findAllArticles();
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleDto })
  async getOneArticle(@Param('id') params: string): Promise<IArticle> {
    return this.service.findOneArticle(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: ArticleDto })
  async createArticle(@Body() createArticleDto: ArticleDto): Promise<IArticle> {
    return this.service.createArticle(createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ type: ArticleDto })
  async updateArticle(
    @Param('id') params: string,
    @Body() updateArticleDto: ArticleDto,
  ): Promise<IArticle> {
    console.log(params);
    return this.service.updateArticle(params, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteArticle(@Param('id') params: string): Promise<IArticle> {
    return this.service.deleteArticle(params);
  }
}
