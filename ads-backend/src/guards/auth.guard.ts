import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() reflector: Reflector;
  @Inject() jwtService: JwtService;

  private handleToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      Logger.log(request.url, 'auth guard !token');
      return false;
    }

    const bearer = token.split(' ')[1];
    const user = this.jwtService.decode(bearer);
    return user;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = this.handleToken(context);

    if (isPublic) {
      request.user = user;
      return true;
    }

    if (!user) {
      return false;
    }

    request.user = user;

    return true;
  }
}
