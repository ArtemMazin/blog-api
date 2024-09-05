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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  ResponseUserDto,
  ToggleFavoriteArticleDto,
  UpdateProfileDto,
} from './dto';
import {
  ApiCommonResponses,
  ApiUserResponses,
} from 'src/decorators/api-responses.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  async getProfile(
    @Req() req: Request & { user: ResponseUserDto },
  ): Promise<ResponseUserDto> {
    return this.usersService.findByEmail(req.user.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiUserResponses()
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('favorite-article')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить/удалить статью в/из избранного' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiCommonResponses()
  async toggleFavoriteArticle(
    @Req() req: Request & { user: ResponseUserDto },
    @Body() toggleFavoriteArticleDto: ToggleFavoriteArticleDto,
  ): Promise<ResponseUserDto> {
    const { articleId, action } = toggleFavoriteArticleDto;
    const userId = req.user._id.toString();

    if (action === 'add') {
      return this.usersService.addFavoriteArticle(userId, articleId);
    } else {
      return this.usersService.removeFavoriteArticle(userId, articleId);
    }
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
    @Req() req: Request & { user: ResponseUserDto },
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\// })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    const userId = req.user._id.toString();
    return this.usersService.updateProfile(userId, updateProfileDto, file);
  }
}
