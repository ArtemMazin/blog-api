import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { CreateBaseArticleDto } from 'src/modules/base-article/dto/create-article.dto';

enum Gender {
  Male = 'Мужской',
  Female = 'Женский',
  Other = 'Другое',
}

export class CreateCharacterArticleDto extends CreateBaseArticleDto {
  @ApiProperty({ description: 'Имя персонажа' })
  @IsNotEmpty()
  @IsString()
  characterName: string;

  @ApiProperty({ description: 'Дата рождения', required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ description: 'Дата смерти', required: false })
  @IsOptional()
  @IsString()
  deathDate?: string;

  @ApiProperty({ description: 'Раса персонажа' })
  @IsNotEmpty()
  @IsString()
  race: string;

  @ApiProperty({ description: 'Пол персонажа', enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Рост персонажа', required: false })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({ description: 'Родной мир персонажа' })
  @IsNotEmpty()
  @IsString()
  homeWorld: string;
}
