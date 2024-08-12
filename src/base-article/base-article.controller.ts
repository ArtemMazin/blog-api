import {
  Body,
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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthorGuard } from 'src/guards/author.guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import { ResponseUserDto } from 'src/users/dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

export abstract class BaseArticleController<T, CreateDto, ResponseDto> {
  constructor(protected readonly service: any) {}

  @Get('all')
  @ApiOkResponse({ type: Object, isArray: true })
  async getAllArticles(): Promise<ResponseDto[]> {
    return this.service.findAllArticles();
  }

  @Get('my-all')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Object, isArray: true })
  async getMyAllArticles(
    @Req() req: { user: ResponseUserDto },
  ): Promise<ResponseDto[]> {
    return await this.service.findMyAllArticles(req.user._id.toString());
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('find/:id')
  @ApiOkResponse({ type: Object })
  async getOneArticle(
    @Param('id') params: string,
    @Req() req: { user?: ResponseUserDto },
  ): Promise<ResponseDto> {
    return await this.service.findOneArticle(params, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Создать новую статью' })
  @ApiBody({
    type: CreateArticleDto,
  })
  async createArticle(
    @Body() createArticleDto: CreateDto,
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
  ): Promise<T> {
    const userId = req.user._id.toString();

    return await this.service.createArticle(createArticleDto, userId, file);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Обновить статью' })
  @ApiBody({
    type: UpdateArticleDto,
  })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<CreateDto>,
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
  ): Promise<ResponseDto> {
    return await this.service.updateArticle(id, updateArticleDto, file);
  }

  @UseGuards(JwtAuthGuard, AuthorGuard)
  @Delete('delete/:id')
  async deleteArticle(@Param('id') params: string): Promise<ResponseDto> {
    return this.service.deleteArticle(params);
  }

  @Get('search')
  @ApiOkResponse({ type: Object, isArray: true })
  async searchArticles(@Query('query') query: string): Promise<ResponseDto[]> {
    return this.service.searchArticles(query);
  }
}
