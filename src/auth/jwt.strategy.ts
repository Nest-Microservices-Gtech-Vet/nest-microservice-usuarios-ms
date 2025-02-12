import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
    return { userId: payload.userId, role: payload.role };
  }
}
