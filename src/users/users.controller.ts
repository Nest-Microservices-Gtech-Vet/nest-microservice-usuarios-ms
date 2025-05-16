import { Controller, Body, ParseIntPipe, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  //@Post()

  @MessagePattern({ cmd: 'create_users' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @MessagePattern('auth.register.user')
  // registerUser(@Payload() registerUserDto: CreateUserDto){
  //   return this.usersService.create(registerUserDto);
  // }

  //Get()F

  @MessagePattern({ cmd: 'findAll_users' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }



  @MessagePattern({ cmd: 'findOne_users' })
  findOne(@Payload() payload: any) {
    console.log('📥 Received payload en usuarios-ms:', payload);
    const usua_id = payload.id;
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


}
