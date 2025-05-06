import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const data = context.switchToRpc().getData(); // 🔥 Esto obtiene el usuario correctamente en microservicios

    if (!data?.user || !requiredRoles.includes(data.user.role)) {
      throw new ForbiddenException('🚫 No tienes permisos para acceder a esta ruta');
    }

    return true;
  }
}
