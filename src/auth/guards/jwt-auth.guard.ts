import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToRpc().getData(); // 🚀 Extraemos los datos del payload (TCP)
    
    if (!request || !request.user) {
      throw new UnauthorizedException('🚫 No autorizado. Falta el token');
    }
    
    return true;
  }
}