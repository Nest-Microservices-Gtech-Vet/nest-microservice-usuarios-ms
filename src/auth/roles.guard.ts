import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor( private readonly allowedRoles: string[]) {}

    canActivate(context: ExecutionContext){
        const request = context.switchToRpc().getData();
        const user = request?.user;

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if (!this.allowedRoles.includes(user.role)){
            throw new ForbiddenException(`Acceso denegado para el rol: ${user.role}`);
        }
        return true;
    }
}