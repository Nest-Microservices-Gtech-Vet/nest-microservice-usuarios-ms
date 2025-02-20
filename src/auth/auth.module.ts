import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMPRESAS_SERVICE, USERS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [
    JwtModule.register({
      secret: envs.secret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
      ClientsModule.register([
        {
          name: EMPRESAS_SERVICE,
          transport: Transport.TCP,
          options: {
            host: envs.empresasMicroserviceHost,
            port: envs.empresasMicroservicePort,
          }
        },
      ]),
      ClientsModule.register([
        { 
          name: USERS_SERVICE,  // <--- Asegúrate de que coincide con el nombre en `usuarios-ms`
          transport: Transport.TCP,
          options: {
            host: envs.usersMicroserviceHost,
            port: envs.usersMicroservicePort,
          } 
        },
      ]),
    ],
})
export class AuthModule {}
