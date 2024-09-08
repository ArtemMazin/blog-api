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
import { RaceArticle } from 'src/schemas/race-article.schema';
import { ResponseUserDto } from '../users/dto';
import {
  CreateRaceArticleDto,
  ResponseRaceArticleDto,
  UpdateRaceArticleDto,
} from './dto';
import { RaceArticleService } from './race-article.service';

@ApiTags('Статьи о расах')
@Controller('race-articles')
export class RaceArticleController extends BaseArticleController<
  RaceArticle,
  CreateRaceArticleDto,
  UpdateRaceArticleDto,
  ResponseRaceArticleDto
> {
  constructor(private raceArticleService: RaceArticleService) {
    super(raceArticleService);
  }

  @Get('all')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Получить все статьи о расах' })
  @ApiOkResponse({ type: ResponseRaceArticleDto, isArray: true })
  @ApiCommonResponses()
  getAllRaceArticles() {
    return super.getAllArticles();
  }

  @Get('my-all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить все мои статьи о расах' })
  @ApiOkResponse({ type: ResponseRaceArticleDto, isArray: true })
  @ApiAuthResponses()
  getMyAllRaceArticles(@Req() req: { user: ResponseUserDto }) {
    return super.getMyAllArticles(req.user._id.toString());
  }

  @Get('find/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Получить одну статью о расе' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseRaceArticleDto })
  @ApiCommonResponses()
  getOneRaceArticle(
    @Param('id') id: string,
    @Req() req: { user?: ResponseUserDto },
  ) {
    return super.getOneArticle(id, req.user);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Создать новую статью о расе' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRaceArticleDto })
  @ApiCreatedResponse({ type: ResponseRaceArticleDto })
  @ApiAuthResponses()
  createRaceArticle(
    @Body() createArticleDto: CreateRaceArticleDto,
    @Req() req: { user: ResponseUserDto },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return super.createArticle(createArticleDto, req.user, file);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Обновить статью о расе' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRaceArticleDto })
  @ApiOkResponse({ type: ResponseRaceArticleDto })
  @ApiAuthResponses()
  updateRaceArticle(
    @Param('id') id: string,
    @Req() req: { user: ResponseUserDto },
    @Body() updateArticleDto: UpdateRaceArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return super.updateArticle(id, req.user, updateArticleDto, file);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @ApiOperation({ summary: 'Удалить статью о расе' })
  @ApiParam({ name: 'id', type: String })
  @ApiSuccessResponse()
  @ApiAuthResponses()
  deleteRaceArticle(@Param('id') id: string) {
    return super.deleteArticle(id);
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Поиск статей о расах' })
  @ApiQuery({ name: 'query', type: String })
  @ApiOkResponse({ type: ResponseRaceArticleDto, isArray: true })
  @ApiCommonResponses()
  searchRaceArticles(@Query('query') query: string) {
    return super.searchArticles(query);
  }

  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Лайкнуть статью о расе' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseRaceArticleDto })
  @ApiAuthResponses()
  likeRaceArticle(@Param('id') id: string) {
    return this.raceArticleService.likeArticle(id);
  }

  @Post('unlike/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Убрать лайк со статьи о расе' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ResponseRaceArticleDto })
  @ApiAuthResponses()
  unlikeRaceArticle(@Param('id') id: string) {
    return this.raceArticleService.unlikeArticle(id);
  }

  @Get('top')
  @ApiOperation({ summary: 'Получить топ-5 статей о расах' })
  @ApiOkResponse({ type: ResponseRaceArticleDto, isArray: true })
  @ApiCommonResponses()
  getTopRaceArticles() {
    return this.raceArticleService.getTopArticles();
  }
}
