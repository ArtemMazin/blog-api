import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'luke@rebellion.com',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'usetheforce123',
  })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 30, { message: 'Пароль должен быть от 6 до 30 символов' })
  readonly password: string;
}
