import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Люк Скайуокер',
    required: true,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 50, { message: 'Имя должно быть от 2 до 50 символов' })
  readonly name: string;

  @ApiProperty({
    description: 'Информация о пользователе',
    example: 'Джедай и пилот X-wing',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Информация о пользователе должна быть строкой' })
  @Length(0, 500, {
    message: 'Информация о пользователе не должна превышать 500 символов',
  })
  readonly about?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение профиля',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}
