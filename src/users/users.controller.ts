import { Controller, Body, ParseIntPipe, UseGuards, HttpStatus } from '@nestjs/common';
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
  async create(@Payload() data: { createUserDto: CreateUserDto; createdBy: number}) {
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

  //Get()
  //@UseGuards(JwtAuthGuard)
  //@MessagePattern({ cmd: 'findAll_users'})
  //@UseGuards(JwtAuthGuard)
  //findAll(@Payload()paginationDto: PaginationDto) {
  //return this.usersService.findAll(paginationDto);
  //}
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
  async findOne(@Payload('usua_id', ParseIntPipe) usua_id: number) {
    return this.usersService.findOne(usua_id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_users' })
  update(
    //@Param('id', ParseIntPipe) usua_id: number, 
    //@Body() updateUserDto: UpdateUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {

    return this.usersService.update(updateUserDto.usua_id, updateUserDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_users' })
  remove(@Payload('usua_id', ParseIntPipe) usua_id: number) {
    const ue = usua_id;
    console.log(`el usuario ${ue} a sido eliminado`)
    return this.usersService.remove(usua_id);

  }
}
