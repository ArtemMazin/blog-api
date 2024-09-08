import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthorGuard } from 'src/guards/author.guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import {
  ApiCommonResponses,
  ApiAuthResponses,
  ApiSuccessResponse,
} from 'src/decorators/api-responses.decorator';
import { BaseArticleController } from '../base-article/base-article.controller';
import { CharacterArticleService } from './character-article.service';
import { CharacterArticle } from 'src/schemas/character-article.schema';
import {
  CreateCharacterArticleDto,
  UpdateCharacterArticleDto,
  ResponseCharacterArticleDto,
} from './dto';
import { ResponseUserDto } from '../users/dto';

@ApiTags('Статьи о персонажах')
@Controller('character-articles')
export class CharacterArticleController extends BaseArticleController<
  CharacterArticle,
  CreateCharacterArticleDto,
  UpdateCharacterArticleDto,
  ResponseCharacterArticleDto
  // CharacterArticleService
> {
  constructor(private characterArticleService: CharacterArticleService) {
    super(characterArticleService);
  }

  @Get('all')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Получить все статьи о персонажах' })
  @ApiOkResponse({ type: ResponseCharacterArticleDto, isArray: true })
  @ApiCommonResponses()
  getAllCharacterArticles() {
    return super.getAllArticles();
  }

  @Get('my-all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить все мои статьи о персонажах' })
  @ApiOkResponse({ type: ResponseCharacterArticleDto, isArray: true })
  @ApiAuthResponses()
  getMyAllCharacterArticles(@Req() req: { user: ResponseUserDto }) {
    return super.getMyAllArticles(req.user._id.toString());
  }

  @Get('find/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Получить одну статью о персонаже' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseCharacterArticleDto })
  @ApiCommonResponses()
  getOneCharacterArticle(
    @Param('id') id: string,
    @Req() req: { user?: ResponseUserDto },
  ) {
    return super.getOneArticle(id, req.user);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Создать новую статью о персонаже' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCharacterArticleDto })
  @ApiCreatedResponse({ type: ResponseCharacterArticleDto })
  @ApiAuthResponses()
  createCharacterArticle(
    @Body() createArticleDto: CreateCharacterArticleDto,
    @Req() req: { user: ResponseUserDto },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return super.createArticle(createArticleDto, req.user, file);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Обновить статью о персонаже' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCharacterArticleDto })
  @ApiOkResponse({ type: ResponseCharacterArticleDto })
  @ApiAuthResponses()
  updateCharacterArticle(
    @Param('id') id: string,
    @Req() req: { user: ResponseUserDto },
    @Body() updateArticleDto: UpdateCharacterArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return super.updateArticle(id, req.user, updateArticleDto, file);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @ApiOperation({ summary: 'Удалить статью о персонаже' })
  @ApiParam({ name: 'id', type: String })
  @ApiSuccessResponse()
  @ApiAuthResponses()
  deleteCharacterArticle(@Param('id') id: string) {
    return super.deleteArticle(id);
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Поиск статей о персонажах' })
  @ApiQuery({ name: 'query', type: String })
  @ApiOkResponse({ type: ResponseCharacterArticleDto, isArray: true })
  @ApiCommonResponses()
  searchCharacterArticles(@Query('query') query: string) {
    return super.searchArticles(query);
  }

  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Лайкнуть статью о персонаже' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseCharacterArticleDto })
  @ApiAuthResponses()
  likeCharacterArticle(@Param('id') id: string) {
    return this.characterArticleService.likeArticle(id);
  }

  @Post('unlike/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Убрать лайк со статьи о персонаже' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseCharacterArticleDto })
  @ApiAuthResponses()
  unlikeCharacterArticle(@Param('id') id: string) {
    return this.characterArticleService.unlikeArticle(id);
  }

  @Get('top')
  @ApiOperation({ summary: 'Получить топ-5 статей о персонажах' })
  @ApiOkResponse({ type: ResponseCharacterArticleDto, isArray: true })
  @ApiCommonResponses()
  getTopCharacterArticles() {
    return this.characterArticleService.getTopArticles();
  }
}
