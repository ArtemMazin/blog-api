import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: SignUpDto })
  async signUp(@Body() user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @Post('sign-in')
  @ApiOkResponse({ type: SignInDto })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInDto) {
    return await this.authService.signIn(user.email, user.password);
  }
}
