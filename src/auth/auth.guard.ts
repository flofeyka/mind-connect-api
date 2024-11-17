import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.split(' ')[1];
      const payload: { _id: number; email: string } =
        await this.tokenService.verifyAccessToken(token);

      request.user = payload;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
