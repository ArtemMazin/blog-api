import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  constructor() {
    super('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
