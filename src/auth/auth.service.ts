import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    console.log('🔑 JWT_SECRET en AuthService:', envs.jwtSecret);
  }

  async validateUser(loginData: { email?: string; ruc?: string; password: string }) {
    console.log('📩 Datos recibidos para login:', loginData);
    let user;

    if (loginData.email) {
      console.log('🔍 Buscando usuario por email...');
      user = await this.prisma.usuarios.findUnique({ where: { usua_email: loginData.email } });
    } else if (loginData.ruc) {
      console.log('🔍 Buscando usuario por RUC...');
      user = await this.prisma.usuarios.findUnique({ where: { usua_ruc: loginData.ruc } });
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.activo) {
      throw new RpcException({
        message: '🚫 Usuario inactivo, contacta al administrador',
        status: 403,
      });
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.usua_contrasenia);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    console.log('✅ Usuario autenticado:', user.usua_id);
    return this.generateToken(user);
  }

  async generateToken(user: any) {
    console.log('🛠 Generando token con clave:', envs.jwtSecret);

    const payload = { userId: user.usua_id, role: user.usua_rol };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: envs.jwtSecret,
        expiresIn: '1h',
      }),
    };
  }
}
