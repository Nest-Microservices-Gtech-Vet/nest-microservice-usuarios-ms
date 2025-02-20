import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { EMPRESAS_SERVICE, envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient {

    constructor(
        @Inject(EMPRESAS_SERVICE) private readonly empresasClient: ClientProxy,
        private readonly jwtService: JwtService) {
        super();
    }

    async loginSuperAdmin(email: string, password: string) {
        console.log(`Intentanto autenticar SUPÉRADMIN con email: ${email}`)
        const user = await this.usuarios.findUnique({
            where: {
                usua_email: email,
                activo: true,
            }
        });
        if (!user || user.usua_rol !== 'SUPERADMIN') {
            throw new UnauthorizedException('🚫 Usuario no encontrado o sin permisos.');
        }

        if (user.usua_contrasenia !== password) {
            throw new UnauthorizedException('🚫 Contraseña incorrecta.');
        }

        return {
            userId: user.usua_id,
            role: user.usua_rol,
            accesToken: this.jwtService.sign({ userId: user.usua_id, role: user.usua_rol },{secret: envs.secret})
        };
    }

    async loginAdmin(ruc: string, password: string) {
        console.log(`🔍 Intentando autenticar ADMIN con RUC: ${ruc}`);
        const user = await this.usuarios.findUnique({
            where: {
                usua_ruc: ruc,
                activo: true
            }
        });
        if (!user || user.usua_rol !== 'ADMIN') {
            throw new UnauthorizedException('🚫 Usuario no encontrado o sin permisos.');
        }
        if (user.usua_contrasenia !== password) {
            throw new UnauthorizedException('🚫 Contraseña incorrecta.');
        }
        //Obtener empresas asignadas al admin
        const empresas = await this.empresasClient
            .send({ cmd: 'findEmpresasByAdmin' }, { usua_admin_id: user.usua_id })
            .toPromise()
            .catch(error => {
                console.error('❌ Error llamando a empresas-ms:', error);
                throw new UnauthorizedException('Error obteniendo empresas del usuario.');
            });
        return {
            userId: user.usua_id,
            role: user.usua_rol,
            empresas,
            accessToken: this.jwtService.sign({ userId: user.usua_id, role: user.usua_rol },{secret: envs.secret})
        };
    }
}
