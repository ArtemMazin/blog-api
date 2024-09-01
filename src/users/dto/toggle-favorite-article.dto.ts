import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleFavoriteArticleDto {
  @ApiProperty({
    description: 'ID статьи для добавления/удаления в избранное',
    example: '60d5ecb74f421b2d1c8829fb',
  })
  @IsNotEmpty({ message: 'ID статьи не может быть пустым' })
  @IsString({ message: 'ID статьи должно быть строкой' })
  readonly articleId: string;
}
