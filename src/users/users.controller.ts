import { Controller, Body, ParseIntPipe, UseGuards, HttpStatus, UnauthorizedException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //@Post()
  @MessagePattern('create_users')
  @UseGuards(JwtAuthGuard, new RolesGuard(['SUPERADMIN']))
  async create(@Payload() data: { createUserDto: CreateUserDto; createdBy: number }) {
    console.log('📩 Datos recibidos en usuarios-ms (crear usuario):', data);

    if (!data.createdBy) {
      throw new RpcException({
        message: '❌ createdBy es requerido',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return this.usersService.create({
      ...data.createUserDto,
      createdBy: data.createdBy,
    });
  }

  @MessagePattern('findAll_users')
  @UseGuards(JwtAuthGuard, new RolesGuard(['SUPERADMIN'])) // Protege la ruta con JWT@@
  async findAll(@Payload() data) {
    console.log('✅ Petición recibida en usuarios-ms:', data);

    if (!data.pagination) {
      throw new Error('❌ No se recibió la paginación correctamente');
    }

    return this.usersService.findAll(data.pagination);
  }


  //@Get(':id')
  @MessagePattern({ cmd: 'findOne_users' })
  @UseGuards(JwtAuthGuard, new RolesGuard(['SUPERADMIN']))
  async findOne(@Payload() data: { usua_id: number, }) {
    console.log(`🔍 Buscando usuario con ID: ${data.usua_id}`);

    const user = await this.usersService.findOne(data.usua_id);
    if (!user) {
      throw new RpcException('❌ Usuario no encontrado en la base de datos');
    }

    console.log('✅ Usuario encontrado:', user);
    return user;
  }



  //@Patch(':id')
  @MessagePattern('update_users')
  @UseGuards(JwtAuthGuard, new RolesGuard(['SUPERADMIN']))
  async update(@Payload() data: { usua_id: number; updateUserDto: UpdateUserDto; updatedBy: number; authorization: string }) {
    console.log('📩 Datos recibidos en usuarios-ms (actualizar usuario):', data);

    if (!data.authorization) {
      console.error('❌ No Authorization header encontrado en usuarios-ms');
      throw new UnauthorizedException('Token no recibido en usuarios-ms');
    }

    console.log(`🛠 Token recibido en usuarios-ms: ${data.authorization}`);
    console.log(`🔄 Intentando actualizar usuario con ID: ${data.usua_id}`);
    console.log(`🔄 Datos a actualizar:`, data.updateUserDto);
    console.log(`👤 Actualizado por: ${data.updatedBy}`);

    return this.usersService.update(data.usua_id, {
      ...data.updateUserDto,
      updatedBy: data.updatedBy,
    });
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_users' })
  @UseGuards(JwtAuthGuard, new RolesGuard(['SUPERADMIN']))
  async remove(@Payload() data: { usua_id: number, updatedBy: number, authorization: string }) {
    console.log(`🗑️ Recibida solicitud para borrar usuario con ID: ${data.usua_id}`);

    // Convertir el ID a número
    const userId = Number(data.usua_id);
    if (isNaN(userId)) {
      console.error(`❌ Error: usua_id debe ser un número válido`);
      throw new RpcException('El ID del usuario debe ser un número válido');
    }
    
    const deleteUser = await this.usersService.remove(data.usua_id, data.updatedBy);
    if (!deleteUser) {
      throw new RpcException('❌ No se pudo eliminar el usuario');
    }
    console.log(`✅ Usuario con ID ${data.usua_id} marcado como inactivo`);
    return { message: 'Usuario eliminado correctamente', deleteUser };

  }
}
