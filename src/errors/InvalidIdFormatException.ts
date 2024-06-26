import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdFormatException extends HttpException {
  constructor() {
    super('Неверный формат id', HttpStatus.BAD_REQUEST);
  }
}
