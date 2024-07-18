import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IUserWithoutPassword } from 'types/types';

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
  @IsNotEmpty()
  newUser: IUserWithoutPassword;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
