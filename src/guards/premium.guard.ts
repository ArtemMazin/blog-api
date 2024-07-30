import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PremiumGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPremium = request.user.isPremium;

    if (!isPremium) {
      throw new ForbiddenException();
    }

    return true;
  }
}
