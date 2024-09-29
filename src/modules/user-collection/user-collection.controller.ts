import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiCommonResponses } from 'src/decorators/api-responses.decorator';
import { ResponseUserCollectionDto } from './dto';
import { ResponseRollCharacterDto } from './dto/response-roll-character.dto';

@ApiTags('Коллекция пользователя')
@Controller('user-collection')
export class UserCollectionController {
  constructor(private readonly userCollectionService: UserCollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить коллекцию текущего пользователя' })
  @ApiOkResponse({ type: ResponseUserCollectionDto })
  @ApiCommonResponses()
  async getUserCollection(
    @Req() req: Request & { user: { _id: string } },
  ): Promise<ResponseUserCollectionDto> {
    return this.userCollectionService.getUserCollection(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('roll')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить случайного персонажа' })
  @ApiOkResponse({ type: ResponseRollCharacterDto })
  @ApiCommonResponses()
  async rollCharacter(
    @Req() req: Request & { user: { _id: string } },
  ): Promise<ResponseRollCharacterDto> {
    return this.userCollectionService.rollCharacter(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-daily-rolls')
  async resetDailyRolls() {
    await this.userCollectionService.resetDailyRolls();
    return { message: 'Ежедневные попытки сброшены' };
  }
}
