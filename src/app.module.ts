import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }), UsersModule, ],

})
export class AppModule { }
