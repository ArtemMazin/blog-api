import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectDataException extends HttpException {
  constructor() {
    super('Введены некорректные данные', HttpStatus.BAD_REQUEST);
  }
}
