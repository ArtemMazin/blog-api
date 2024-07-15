import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ArticleDto, UpdateArticleDto } from './dto';
import { IAuthRequest, IArticle } from 'types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthorGuard } from 'src/auth/guards/author.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('article')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('all')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getAllArticles(): Promise<IArticle[]> {
    return this.service.findAllArticles();
  }

  @Get('my-all')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getMyAllArticles(@Req() req: IAuthRequest): Promise<IArticle[]> {
    return this.service.findMyAllArticles(req.user._id.toString());
  }

  @Get('find/:id')
  @ApiOkResponse({ type: ArticleDto })
  async getOneArticle(@Param('id') params: string): Promise<IArticle> {
    return this.service.findOneArticle(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreatedResponse({ type: ArticleDto })
  async createArticle(
    @Body() createArticleDto: ArticleDto,
    @Req() req: IAuthRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^image\//,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<IArticle> {
    const userId = req.user._id.toString();

    return this.service.createArticle(createArticleDto, userId, file);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Patch('update/:id')
  @ApiOkResponse({ type: ArticleDto })
  async updateArticle(
    @Param('id') params: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<IArticle> {
    return this.service.updateArticle(params, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
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
