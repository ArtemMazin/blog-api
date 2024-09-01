import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Токен сброса пароля',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'Токен сброса пароля не может быть пустым' })
  @IsString({ message: 'Токен сброса пароля должен быть строкой' })
  readonly resetToken: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newforce123',
  })
  @IsNotEmpty({ message: 'Новый пароль не может быть пустым' })
  @IsString({ message: 'Новый пароль должен быть строкой' })
  @Length(6, 30, { message: 'Новый пароль должен быть от 6 до 30 символов' })
  readonly newPassword: string;
}
