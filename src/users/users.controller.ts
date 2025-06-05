import { BadRequestException, Controller, Inject, Logger, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/common';
import { ClientProxy, MessagePattern, Payload, } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { Rol } from '@prisma/client';
import { FiltroUsuariosDto } from './dto/filtrar-usuario.dto';
import { GetUsuariosPorRolDto } from './dto/get-usuarios-por-rol.dto';
import { NATS_SERVICE } from 'src/config';




@Controller()
export class UsersController {

  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,

  ) { }

  //@Post()

  @MessagePattern({ cmd: 'create_users' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @MessagePattern({ cmd: 'findAll_users' })
  findAll(@Payload() payload:{paginationDto: PaginationDto; }) {

    return this.usersService.findAll(payload.paginationDto);
  }

  @MessagePattern({ cmd: 'findAll_users.inactive' })
  findAllInactive(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAllInactive(paginationDto);
  }



  @MessagePattern({ cmd: 'findOne_users' })
  findOne(@Payload('id', ParseIntPipe) usua_id: number) {
    console.log('📥 Received payload en usuarios-ms:', usua_id);

    return this.usersService.findOne(usua_id);
  }






  //@Patch(':id')

  @MessagePattern({ cmd: 'update_users' })
  update(@Payload() payload: any) {
    const { usua_id, updatedBy, ...updateUserDto } = payload;
    return this.usersService.update(usua_id, updateUserDto, updatedBy);
  }

  //@Delete(':id')

  @MessagePattern({ cmd: 'delete_users' })
  remove(@Payload() payload: any) {
    const { usua_id, updatedBy } = payload;
    console.log(`el usuario ${usua_id} a sido eliminadopor ${updatedBy}`)
    return this.usersService.remove(usua_id, updatedBy);

  }
  //inicio check usuario ADMIN , activo
  @MessagePattern('validar_user_admin')
  async validarUserAdmin(usua_admin_id: number) {
    console.log(`🛠️ [usuarios-ms] Validando admin para ID: ${usua_admin_id}`);

    try {
      const user = await this.usersService.findOne(usua_admin_id);
      const esAdmin = user.usua_rol === 'ADMIN';
      if (!esAdmin) {
        console.warn(`⚠️ [usuarios-ms] Usuario ${usua_admin_id} no es ADMIN`);
        return { valid: false };
      }
      console.log(`✅ [usuarios-ms] Usuario ${usua_admin_id} es ADMIN y activo`);
      return { valid: true };
    } catch (error) {
      console.error(`❌ [usuarios-ms] Error validando usuario admin`, error);
      // devolvemos false si hubo error (o puedes propagar la excepción)
      return { valid: false };
    }
  }
  //fin check usuario ADMIN , activo


  //*************************************************************************************** */
  @MessagePattern({ cmd: 'findAll_users.byRole' })
  async findAllUsersByRole(@Payload() data: { usua_rol: Rol[] }) {
    this.logger.log('📥 [usuarios-ms] Buscar usuarios por rol:', data.usua_rol);
    return this.usersService.findByRole(data.usua_rol);
  }



  @MessagePattern('usuarios.getByIds')
  async getByIds(@Payload() data: { ids: number[] }) {
    const usuarios = await this.usersService.findByIds(data.ids);
    return usuarios.map(u => ({
      usua_id: u.usua_id,
      usua_nombre: u.usua_nombre,
      usua_apellido: u.usua_apellido,
      usua_email: u.usua_email,
      usua_rol: u.usua_rol,
    }));
  }

  //*************************************************************************************** */

  @MessagePattern({ cmd: 'ping_test' })
  handlePingTest(@Payload() data: any) {
    console.log('📥 [usuarios-ms] Recibido ping_test con payload:', data);
    return { message: 'pong desde usuarios-ms' };
  }

}
