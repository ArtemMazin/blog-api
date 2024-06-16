import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ArticleDto, UpdateArticleDto } from './dto';
import { IAuthRequest, IArticle } from 'types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('article')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('all')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getAllArticles(): Promise<IArticle[]> {
    return this.service.findAllArticles();
  }

  @Get('find/:id')
  @ApiOkResponse({ type: ArticleDto })
  async getOneArticle(@Param('id') params: string): Promise<IArticle> {
    return this.service.findOneArticle(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: ArticleDto })
  async createArticle(
    @Body() createArticleDto: ArticleDto,
    @Req() req: IAuthRequest,
  ): Promise<IArticle> {
    const userId = req.user._id.toString();

    return this.service.createArticle(createArticleDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @ApiOkResponse({ type: ArticleDto })
  async updateArticle(
    @Param('id') params: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<IArticle> {
    return this.service.updateArticle(params, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteArticle(@Param('id') params: string): Promise<IArticle> {
    return this.service.deleteArticle(params);
  }

  @Get('search')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async searchArticles(@Query('query') query: string): Promise<IArticle[]> {
    return this.service.searchArticles(query);
  }
}
