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
import { SignInResponseDto, SignUpDto, SignUpResponseDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { IAuthRequest } from 'types/types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: SignUpResponseDto })
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: SignInResponseDto })
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: IAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: IAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiOkResponse({ type: SignInResponseDto })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req: IAuthRequest,
    // @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  async resetPasswordConfirm(
    @Req() req: IAuthRequest,
    @Body() body: { token: string; newPassword: string },
    // @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.updatePassword(
      req.user,
      body.token,
      body.newPassword,
    );
  }
}
