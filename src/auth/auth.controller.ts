import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: SignUpDto })
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: SignUpDto })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
