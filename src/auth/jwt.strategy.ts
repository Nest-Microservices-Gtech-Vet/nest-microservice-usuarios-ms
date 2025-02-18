import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        console.log('🛠 Token recibido en JwtStrategy:', req?.authorization);

        if (req?.headers?.authorization) {
          return req.headers.authorization.replace('Bearer ', '');
        } else if (req?.authorization) { // Manejo para TCP
          return req.authorization.replace('Bearer ', '');
        }
        throw new UnauthorizedException('🚫 Token no encontrado');
      },
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('🛠 Token validado con payload:', payload);
  
    if (!payload || !payload.userId) {
      console.error('❌ Error: Payload inválido o sin userId');
      throw new UnauthorizedException('Token inválido');
    }
  
    return { userId: payload.userId, role: payload.role };
  }
  
}
