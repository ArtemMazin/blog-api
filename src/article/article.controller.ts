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
import { ArticleDto, ResponseArticleDto } from './dto';
import { IArticle } from 'types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthorGuard } from 'src/auth/guards/author.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseUserDto } from 'src/users/dto';

@Controller('article')
export class ArticlesController {
  constructor(private readonly service: ArticleService) {}

  @Get('all')
  @ApiOkResponse({ type: ResponseArticleDto, isArray: true })
  async getAllArticles(): Promise<ResponseArticleDto[]> {
    return this.service.findAllArticles();
  }

  @Get('my-all')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async getMyAllArticles(
    @Req() req: { user: ResponseUserDto },
  ): Promise<ResponseArticleDto[]> {
    return await this.service.findMyAllArticles(req.user._id.toString());
  }

  @Get('find/:id')
  @ApiOkResponse({ type: ArticleDto })
  async getOneArticle(
    @Param('id') params: string,
  ): Promise<ResponseArticleDto> {
    return await this.service.findOneArticle(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreatedResponse({ type: ResponseArticleDto })
  async createArticle(
    @Body() createArticleDto: ArticleDto,
    @Req() req: { user: ResponseUserDto },
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

    return await this.service.createArticle(createArticleDto, userId, file);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOkResponse({ type: ResponseArticleDto })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<ArticleDto>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^image\//,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<ResponseArticleDto> {
    return await this.service.updateArticle(id, updateArticleDto, file);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Delete('delete/:id')
  async deleteArticle(
    @Param('id') params: string,
  ): Promise<ResponseArticleDto> {
    return this.service.deleteArticle(params);
  }

  @Get('search')
  @ApiOkResponse({ type: ArticleDto, isArray: true })
  async searchArticles(
    @Query('query') query: string,
  ): Promise<ResponseArticleDto[]> {
    return this.service.searchArticles(query);
  }
}
