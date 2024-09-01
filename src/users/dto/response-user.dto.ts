import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '60d5ecb74f421b2d1c8829fb',
  })
  readonly _id: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Люк Скайуокер',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'luke@rebellion.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'avatar.jpg',
    required: false,
  })
  readonly avatar?: string;

  @ApiProperty({
    description: 'Информация о пользователе',
    example: 'Джедай и пилот X-wing',
    required: false,
  })
  readonly about?: string;

  @ApiProperty({
    description: 'Список ID избранных статей',
    example: ['60d5ecb74f421b2d1c8829fb', '60d5ecb74f421b2d1c8829fc'],
    type: [String],
  })
  readonly favorite_articles: string[];

  @ApiProperty({
    description: 'Статус премиум-подписки',
    example: false,
  })
  readonly isPremium: boolean;
}
