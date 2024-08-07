import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import {
  CreateArticleDto,
  ResponseArticleDto,
  UpdateArticleDto,
} from 'src/base-article/dto';

export class CreateCharacterArticleDto extends CreateArticleDto {
  @ApiProperty({
    example: 'Фродо Бэггинс',
    description: 'Имя персонажа',
  })
  @IsNotEmpty()
  @IsString()
  characterName: string;

  @ApiProperty({
    example: '22 сентября 2968 года Третьей Эпохи',
    description: 'Дата рождения персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({
    example: 'Неизвестно',
    description: 'Дата смерти персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  deathDate?: string;

  @ApiProperty({
    example: 'Хоббит',
    description: 'Раса персонажа',
  })
  @IsNotEmpty()
  @IsString()
  race: string;

  @ApiProperty({
    example: 'Мужской',
    description: 'Пол персонажа',
    enum: ['Мужской', 'Женский', 'Другое'],
  })
  @IsNotEmpty()
  @IsEnum(['Мужской', 'Женский', 'Другое'])
  gender: string;

  @ApiProperty({
    example: 1.06,
    description: 'Рост персонажа в метрах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({
    example: 'Шир',
    description: 'Родной мир персонажа',
  })
  @IsNotEmpty()
  @IsString()
  homeWorld: string;
}

export class UpdateCharacterArticleDto extends UpdateArticleDto {
  @ApiProperty({
    example: 'Фродо Бэггинс',
    description: 'Имя персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  characterName?: string;

  @ApiProperty({
    example: '22 сентября 2968 года Третьей Эпохи',
    description: 'Дата рождения персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({
    example: 'Неизвестно',
    description: 'Дата смерти персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  deathDate?: string;

  @ApiProperty({
    example: 'Хоббит',
    description: 'Раса персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  race?: string;

  @ApiProperty({
    example: 'Мужской',
    description: 'Пол персонажа',
    enum: ['Мужской', 'Женский', 'Другое'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Мужской', 'Женский', 'Другое'])
  gender?: string;

  @ApiProperty({
    example: 1.06,
    description: 'Рост персонажа в метрах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({
    example: 'Шир',
    description: 'Родной мир персонажа',
    required: false,
  })
  @IsOptional()
  @IsString()
  homeWorld?: string;
}

export class ResponseCharacterArticleDto extends ResponseArticleDto {
  @ApiProperty({
    example: 'Фродо Бэггинс',
    description: 'Имя персонажа',
  })
  characterName: string;

  @ApiProperty({
    example: '22 сентября 2968 года Третьей Эпохи',
    description: 'Дата рождения персонажа',
  })
  birthDate?: string;

  @ApiProperty({
    example: 'Неизвестно',
    description: 'Дата смерти персонажа',
  })
  deathDate?: string;

  @ApiProperty({
    example: 'Хоббит',
    description: 'Раса персонажа',
  })
  race: string;

  @ApiProperty({
    example: 'Мужской',
    description: 'Пол персонажа',
    enum: ['Мужской', 'Женский', 'Другое'],
  })
  gender: string;

  @ApiProperty({
    example: 1.06,
    description: 'Рост персонажа в метрах',
  })
  height?: number;

  @ApiProperty({
    example: 'Шир',
    description: 'Родной мир персонажа',
  })
  homeWorld: string;
}
