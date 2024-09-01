import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsString,
  IsBoolean,
  IsArray,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class ResponseUserDto {
  @Expose()
  @ApiProperty({
    description: 'ID пользователя',
    example: '60d5ecb74f421b2d1c8829fb',
  })
  @IsString()
  _id: string;

  @Expose()
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Люк Скайуокер',
  })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Email пользователя',
    example: 'luke@rebellion.com',
  })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @Expose()
  @ApiProperty({
    description: 'Информация о пользователе',
    example: 'Джедай и пилот X-wing',
    required: false,
  })
  @IsOptional()
  @IsString()
  about: string;

  @Expose()
  @ApiProperty({
    description: 'Список ID избранных статей',
    example: ['60d5ecb74f421b2d1c8829fb', '60d5ecb74f421b2d1c8829fc'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  favorite_articles: string[];

  @Expose()
  @ApiProperty({
    description: 'Статус премиум-подписки',
    example: false,
  })
  @IsBoolean()
  isPremium: boolean;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты создания' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate({ message: 'Некорректный формат даты обновления' })
  updatedAt: Date;
}
