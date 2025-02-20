import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { UsersService } from './users.service';
import { EMPRESAS_SERVICE } from 'src/config/services';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    AuthModule,
    JwtModule.register({
      secret: envs.secret, // 🔐 Mover a variables de entorno
      signOptions: { expiresIn: '1h' }
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
  ],
})
export class UsersModule { }
