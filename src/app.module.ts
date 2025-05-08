import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }), UsersModule, AuthModule, ],

})
export class AppModule { }
