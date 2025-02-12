import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    let authHeader;

    if (context.getType() === 'rpc') {
      const rpcData = context.switchToRpc().getData();
      authHeader = rpcData?.authorization;
      console.log('🛠 Token recibido en JwtAuthGuard (TCP):', authHeader);
    } else {
      const req = context.switchToHttp().getRequest();
      authHeader = req.headers?.authorization;
      console.log('🛠 Token recibido en JwtAuthGuard (HTTP):', authHeader);
    }

    if (!authHeader) {
      console.error('❌ No Authorization header found');
      throw new UnauthorizedException('Token is missing');
    }

    return super.canActivate(context);
  }
}
