import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: SignUpDto })
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  @ApiOkResponse({ type: SignUpDto })
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: SignUpDto) {
    return await this.authService.signIn(user.email, user.password);
  }
}
