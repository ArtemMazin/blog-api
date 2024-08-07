import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPremiumStatus extends HttpException {
  constructor() {
    super(
      'Только премиум-пользователи могут создавать премиум-статьи',
      HttpStatus.FORBIDDEN,
    );
  }
}
