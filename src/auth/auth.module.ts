import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { envs } from 'src/config/envs';
import { ConfigModule } from '@nestjs/config';

console.log('🔍 JWT_SECRET en AuthModule:', envs.jwtSecret);
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envs.jwtSecret,
        signOptions: { expiresIn: '1h'},
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService,JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
