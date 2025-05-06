import { Controller, Body, ParseIntPipe, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //@Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @MessagePattern({ cmd: 'create_users' })
  create(@Payload() data: any) {
    return this.usersService.create(data.createUserDto);
  }

  //Get()F
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @MessagePattern({ cmd: 'findAll_users' })
  findAll(@Payload() data: any) {
    console.log('🛠 Token recibido en usuarios-ms:', data.user);

    if (!data.user) {
      throw new Error('🚫 No se recibió el usuario autenticado');
    }
    return this.usersService.findAll(data.paginationDto);
  }

  //@Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @MessagePattern({ cmd: 'findOne_users' })
async findOne(@Payload() data: { usua_id: number }) {
  console.log('📩 [usuarios-ms] Recibida petición para buscar usuario:', data);

  if (!data.usua_id) {
    console.error('🚫 [usuarios-ms] ERROR: No se proporcionó el ID del usuario');
    throw new RpcException({
      message: '🚫 No se proporcionó el ID del usuario',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  try {
    console.log(`🔍 [usuarios-ms] Buscando usuario con ID: ${data.usua_id} en la base de datos...`);

    const user = await this.usersService.findOne(data.usua_id);

    if (!user) {
      console.error(`🚨 [usuarios-ms] Usuario con ID ${data.usua_id} no encontrado en la BD`);
      throw new RpcException({
        message: `Usuario con ID ${data.usua_id} no encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    console.log(`✅ [usuarios-ms] Usuario encontrado y retornado:`, user);
    return user;

  } catch (error) {
    console.error('❌ [usuarios-ms] ERROR en findOne_users:', error);
    throw new RpcException({
      message: '❌ Error interno en usuarios-ms',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

  




  //@Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @MessagePattern({ cmd: 'update_users' })
  update(
    @Payload() data: any
  ) {
    console.log('🛠 Datos recibidos en usuarios-ms:', data);

    if (!data || !data.usua_id || !data.updateUserDto) {
      throw new RpcException({
        message: 'Datos inválidos para actualizar el usuario',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return this.usersService.update(data.usua_id, data.updateUserDto);
  }

  //@Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @MessagePattern({ cmd: 'delete_users' })
  remove(@Payload('usua_id', ParseIntPipe) usua_id: number) {
    const ue = usua_id;
    console.log(`el usuario ${ue} a sido eliminado`)
    return this.usersService.remove(usua_id);

  }
}
