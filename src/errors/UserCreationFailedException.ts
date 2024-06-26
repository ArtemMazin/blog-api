import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreationFailedException extends HttpException {
  constructor() {
    super('Не удалось создать пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
