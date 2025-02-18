import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
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
      where: { usua_email: createUserDto.usua_email },
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
    console.log(`🔍 Buscando en la base de datos usuario con ID: ${usua_id}`);
    const user = await this.usuarios.findFirst({
      where: { usua_id, activo: true }
    });

    if (!user) {
      throw new RpcException({
        message: `Usuario con el id #${usua_id} no encontrado`,
        status: HttpStatus.BAD_REQUEST,
      })
    }
    return user;
  }

  async update(usua_id: number, updateUserDto: UpdateUserDto) {
    try {
      console.log(`🔄 Actualizando usuario con ID: ${usua_id}`);
      console.log(`🔄 Datos recibidos en updateUserDto:`, updateUserDto);

      //buscar el usuario actual
      const existingUser = await this.usuarios.findUnique({
        where: { usua_id },
      })
      if (!existingUser) {
        console.error('(^O^) usuaeio no encontrado');
        throw new RpcException({
          message: 'Usuario no encontrado',
          status: HttpStatus.NOT_FOUND,
        });
      }
      // verificar si se esta enviando nueva contraseña y encriptarla
      let hashedPassword = existingUser.usua_contrasenia; //mantener contraseña actual
      if (updateUserDto.usua_contrasenia) {
        console.log('🔐 Nueva contraseña detectada, encriptando...');
        hashedPassword = await bcrypt.hash(updateUserDto.usua_contrasenia, 10);
      }
      // Actualizar usuario con los datos proporcionados
      const updatedUser = await this.usuarios.update({
        where: { usua_id },
        data: {
          ...updateUserDto,
          usua_contrasenia: hashedPassword,
          updatedBy: updateUserDto.updatedBy || null, // 🔥 Asegurarse de que el updatedBy no sea undefined
          updated_at: new Date(), // 🔥 Agregar la fecha de actualización
        },
      });

      console.log(`✅ Usuario actualizado correctamente:`, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error al actualizar el usuario:', error);
      throw new RpcException({
        message: 'Error al actualizar el usuario',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(usua_id: number, updatedBy: number) {
    try {
      console.log(`🔄 Intentando marcar como inactivo el usuario con ID: ${usua_id}`);
      const existingUser = await this.usuarios.findUnique({ where: { usua_id } });
      if (!existingUser) {
        console.error(`❌ No se encontró el usuario con ID ${usua_id}`);
        throw new RpcException('Usuario no encontrado');
      }

      const updatedUser = await this.usuarios.update({
        where: { usua_id },
        data: {
          activo: false,
          updatedBy,
          updated_at: new Date(),
        },
      });
      console.log(`✅ Usuario con ID ${usua_id} marcado como inactivo:`, updatedUser);
      return updatedUser;
    } catch (error){
      console.error('❌ Error al intentar eliminar usuario:', error);
    throw new RpcException({
      message: 'Error al eliminar el usuario',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
            
}