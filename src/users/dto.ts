import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { exampleUser } from 'src/common/constants';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John',
    description: 'User name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'description',
    description: 'User description',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({
    example: 'uploads/avatars/avatar_1721823078659.png',
    description: 'User avatar',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: '123456ABC',
    description: 'User password',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: exampleUser.resetPasswordToken,
    description: 'User reset password token',
  })
  @IsString()
  @IsOptional()
  resetPasswordToken?: string;

  @ApiProperty({
    example: exampleUser.resetPasswordExpires,
    description: 'User reset password expires',
  })
  @IsString()
  @IsOptional()
  resetPasswordExpires?: Date;
}

export class ResponseUserDto {
  @ApiProperty({
    example: exampleUser._id,
    description: 'User object',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    example: exampleUser.name,
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: exampleUser.email,
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: exampleUser.favorite_articles,
    description: 'User favorite articles',
  })
  @IsArray()
  @IsNotEmpty()
  favorite_articles: string[];

  @ApiProperty({
    example: exampleUser.avatar,
    description: 'User avatar',
  })
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({
    example: exampleUser.about,
    description: 'User description',
  })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({
    example: exampleUser.resetPasswordToken,
    description: 'User reset password token',
  })
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;

  @ApiProperty({
    example: exampleUser.resetPasswordExpires,
    description: 'User reset password expires',
  })
  @IsDate()
  @IsNotEmpty()
  resetPasswordExpires: Date;

  @ApiProperty({
    example: exampleUser.createdAt,
    description: 'User created at',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
