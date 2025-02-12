import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import {PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UserService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
    }


  async create(createUserDto: CreateUserDto) {
    //verificacion del usuario
    const existingUser = await this.usuarios.findUnique({
      where: { usua_email: createUserDto.usua_email},
    });

    if (existingUser) {
      throw new RpcException({
        message: 'El usuario ya existe',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    
    //encriptar la contraseña antes del guardar
    const hashedPassword = await bcrypt.hash(createUserDto.usua_contrasenia, 10)
    try {
      return await this.usuarios.create({
        data: {
          ...createUserDto,
          usua_contrasenia: hashedPassword,
          createdBy: createUserDto.createdBy ?? 0,
          updatedBy: createUserDto.updatedBy ?? 0,
        },
      });
    } catch (error) {
      this.logger.error('error al registrar usuasrio', error);
      throw new RpcException({
        message: 'Error al registrar el usuario',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    
  }

  async findAll(paginationDto: PaginationDto) {
    if (!paginationDto || paginationDto.page === undefined || paginationDto.limit === undefined) {
      throw new Error('❌ Parámetros de paginación incorrectos');
    }
  
    const page = Number(paginationDto.page) || 1; // Asegurar que sea número
    const limit = Number(paginationDto.limit) || 2; // Asegurar que sea número
  
    console.log('📄 Paginación recibida en findAll:', { page, limit });
  
    const totalPages = await this.usuarios.count({ where: { activo: true } });
    const lastPage = Math.ceil(totalPages / limit);
  
    return {
      data: await this.usuarios.findMany({
        skip: (page - 1) * limit,
        take: limit, // ✅ AHORA `limit` ES UN NÚMERO
        where: { activo: true }
      }),
      metadata: {
        total: totalPages,
        page,
        lastPage
      }
    };
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
