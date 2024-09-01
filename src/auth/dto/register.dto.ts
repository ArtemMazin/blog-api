import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Люк Скайуокер',
  })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 50, { message: 'Имя должно быть от 2 до 50 символов' })
  readonly name: string;

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
