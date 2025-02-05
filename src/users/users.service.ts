import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import {PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UserService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
    }
  create(createUserDto: CreateUserDto) {
    return this.usuarios.create({
      data: createUserDto
    });
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page=1, limit=2 } = paginationDto;

    const totalPages =  await this.usuarios.count({where: {activo:true}});
    const lastPage = Math.ceil( totalPages / limit);

    return {
      data: await this.usuarios.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { activo: true }
      }),
      metadata: {
        total: totalPages,
        page:page,
        lastpage: lastPage
      }
    }
  }

  async findOne(usua_id: number) {
    const user = await this.usuarios.findFirst({
      where:{usua_id, activo: true}
    });

    if ( !user ) {
      throw new RpcException({
        message: `Usuario con el id #${usua_id} no encontrado`,
        status: HttpStatus.BAD_REQUEST,
      })
    }
    return user;
  }

  async update(usua_id: number, updateUserDto: UpdateUserDto) {

    const { usua_id: __, ...data } = updateUserDto;
    await this.findOne(usua_id);


    return this.usuarios.update({
      where: {usua_id},
      data: data,
    });
  }

  async remove(usua_id: number) {
    await this.findOne(usua_id);
    //return this.usuarios.delete({
    //  where: {usua_id}
    //});
    const user = await this.usuarios.update({
      where: {usua_id},
      data:{
        activo: false
      }
    });
    return user
  }
}
