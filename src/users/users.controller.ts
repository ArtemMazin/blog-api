import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { IAuthRequest } from 'types/types';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  ResponseUserDto,
  ToggleFavoriteArticleDto,
  UpdateProfileDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCommonResponses,
  ApiUserResponses,
} from 'src/decorators/api-responses.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  getProfile(@Req() req: IAuthRequest) {
    return this.usersService.findByEmail(req.user.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiUserResponses()
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-favorite-article')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить статью в избранное' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  addFavoriteArticle(
    @Req() req: IAuthRequest,
    @Body() addFavoriteArticleDto: ToggleFavoriteArticleDto,
  ) {
    return this.usersService.addFavoriteArticle(
      req.user._id.toString(),
      addFavoriteArticleDto.articleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete-favorite-article')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью из избранного' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  deleteFavoriteArticle(
    @Req() req: IAuthRequest,
    @Body() removeFavoriteArticleDto: ToggleFavoriteArticleDto,
  ) {
    return this.usersService.removeFavoriteArticle(
      req.user._id.toString(),
      removeFavoriteArticleDto.articleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  async updateProfile(
    @Req() req: IAuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
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
  ): Promise<ResponseUserDto> {
    const userId = req.user._id.toString();
    return this.usersService.updateProfile(userId, updateProfileDto, file);
  }
}
