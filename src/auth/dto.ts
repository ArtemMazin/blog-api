import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { exampleUser, exampleToken } from 'src/common/constants';
import { ResponseUserDto } from 'src/users/dto';

export class SignUpDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'User name',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}

export class SignUpResponseDto {
  @ApiProperty({
    example: exampleUser,
    description: 'User object',
  })
  @IsNotEmpty()
  newUser: ResponseUserDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: exampleToken,
    description: 'Access token',
  })
  access_token: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: exampleUser,
    description: 'User object',
  })
  @IsNotEmpty()
  user: ResponseUserDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: exampleToken,
    description: 'Access token',
  })
  access_token: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Вы вышли из аккаунта',
    description: 'Message',
  })
  @IsNotEmpty()
  message: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
  })
  email: string;
}

export class ResponseResetPasswordDto {
  @ApiProperty({
    example: 'Ссылка для сброса пароля отправлена на вашу почту',
    description: 'Message',
  })
  @IsNotEmpty()
  message: string;
}

export class ResetPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: exampleToken,
    description: 'Reset password token',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456AAA',
    description: 'New user password',
  })
  newPassword: string;
}
