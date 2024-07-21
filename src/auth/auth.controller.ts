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
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: SignUpResponseDto })
  async signUp(
    @Body() user: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signUp(user, res);
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

  @Post('reset-password')
  @ApiOkResponse({ type: SignInResponseDto })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { email: string }) {
    return this.authService.resetPassword(body.email);
  }

  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  async resetPasswordConfirm(
    @Body() body: { token: string; newPassword: string },
  ) {
    return this.authService.updatePassword(body.token, body.newPassword);
  }
}
