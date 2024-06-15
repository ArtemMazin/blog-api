import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthRequest } from 'types/types';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProfileResponseDto } from 'src/auth/dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: ProfileResponseDto })
  getProfile(@Req() req: IAuthRequest) {
    return this.usersService.findByEmail(req.user.email);
  }
}
