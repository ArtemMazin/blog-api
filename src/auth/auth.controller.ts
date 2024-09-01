import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Response } from 'express';
import { IAuthRequest } from 'types/types';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResponseUserDto } from 'src/users/dto';
import {
  LoginResponseDto,
  MessageResponseDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: LoginResponseDto })
  async signUp(
    @Body() user: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return await this.authService.signUp(user, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: LoginResponseDto })
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: { user: ResponseUserDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(req.user, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: IAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    return this.authService.logout(res);
  }

  @Post('reset-password')
  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resetPassword(resetPasswordDto.email);
  }

  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  async resetPasswordConfirm(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseUserDto> {
    return this.authService.updatePassword(
      updatePasswordDto.resetToken,
      updatePasswordDto.newPassword,
    );
  }
}
