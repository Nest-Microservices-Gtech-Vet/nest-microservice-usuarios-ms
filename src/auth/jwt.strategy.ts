import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private prisma = new PrismaClient();
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req) {
          console.error('❌ No request object found');
          throw new UnauthorizedException('No request object found');
        }

        const token = req.authorization || req.headers?.authorization;

        if (!token) {
          console.error('❌ No Authorization header found in TCP request');
          throw new UnauthorizedException('Token is missing');
        }

        console.log('🛠 Extrayendo token en JwtStrategy:', token);
        return token.replace('Bearer ', '');
      },
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('🛠 Token validado con payload:', payload);

    const user = await this.prisma.usuarios.findUnique({
      where: { usua_id: payload.userId },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException('🚫 El usuario está inactivo o no existe.');
    }
    return { userId: payload.userId, role: payload.role };
  }
}
