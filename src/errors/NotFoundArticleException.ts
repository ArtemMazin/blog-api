import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundArticleException extends HttpException {
  constructor() {
    super('Статья не найдена', HttpStatus.NOT_FOUND);
  }
}
