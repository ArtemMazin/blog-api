import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthRequest } from 'types/types';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProfileResponseDto, UpdateProfileDto } from './dto';
import { User } from 'src/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: ProfileResponseDto })
  getProfile(@Req() req: IAuthRequest) {
    return this.usersService.findByEmail(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-favorite-article')
  @ApiOkResponse({ type: ProfileResponseDto })
  addFavoriteArticle(
    @Req() req: IAuthRequest,
    @Body() body: { articleId: string },
  ) {
    return this.usersService.addFavoriteArticle(
      req.user._id.toString(),
      body.articleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete-favorite-article')
  @ApiOkResponse({ type: ProfileResponseDto })
  deleteFavoriteArticle(
    @Req() req: IAuthRequest,
    @Body() body: { articleId: string },
  ) {
    return this.usersService.removeFavoriteArticle(
      req.user._id.toString(),
      body.articleId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse({ type: ProfileResponseDto })
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
  ): Promise<User> {
    const userId = req.user._id.toString();

    return this.usersService.updateProfile(userId, updateProfileDto, file);
  }
}
