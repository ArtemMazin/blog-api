import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({ example: 'Обновленный заголовок статьи', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Обновленное содержание статьи...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;

  @ApiProperty({ example: 'true', required: false })
  @IsOptional()
  isPremium?: 'true' | 'false';
}
