import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UsersModule,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  providers: [PrismaService], // 
  exports: [PrismaService],
 
})
export class AppModule {}
