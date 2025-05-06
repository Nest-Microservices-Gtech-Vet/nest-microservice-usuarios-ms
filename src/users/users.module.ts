import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { envs } from 'src/config/envs';
import { UsersService } from './users.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
   
  ],
})
export class UsersModule { }
