import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 🔥 Extraemos el token de Authorization
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Asegurar que JWT_SECRET esté bien configurado
    });
  }

  async validate(payload: any) {
    console.log('🛠 Token validado en usuarios-ms enJWT-STRATEGY:', payload);
    return { userId: payload.userId, role: payload.role };
  }
}
