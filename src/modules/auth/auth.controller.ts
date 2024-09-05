import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { ResponseUserDto } from '../users/dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiAuthResponses,
  ApiCommonResponses,
  ApiRegisterResponses,
  ApiSuccessResponse,
} from 'src/decorators/api-responses.decorator';

@ApiTags('Аутентификация')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiRegisterResponses()
  async registerUser(
    @Body() user: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseUserDto> {
    return await this.authService.registerUser(user, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiAuthResponses()
  async authenticateUser(
    @Req() req: Request & { user: ResponseUserDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseUserDto> {
    return await this.authService.authenticateUser(req.user, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiCommonResponses()
  @ApiSuccessResponse()
  async logoutUser(
    @Req() req: Request & { user: ResponseUserDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    return await this.authService.logoutUser(res);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Запрос на сброс пароля' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiCommonResponses()
  @ApiSuccessResponse()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: boolean }> {
    await this.authService.resetPassword(resetPasswordDto.email);
    return { success: true };
  }

  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтверждение сброса пароля' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiAuthResponses()
  async resetPasswordConfirm(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseUserDto> {
    return this.authService.updatePassword(
      updatePasswordDto.resetToken,
      updatePasswordDto.newPassword,
    );
  }
}
