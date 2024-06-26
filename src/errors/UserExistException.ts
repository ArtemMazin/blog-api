import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistException extends HttpException {
  constructor() {
    super('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
  }
}
