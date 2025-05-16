import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { envs } from 'src/config/envs';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transports/nats.module';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ forwardRef(() => AuthModule), NatsModule],
  exports: [UsersService],
})
export class UsersModule { }
