import { Controller, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //@Post()
  @MessagePattern({ cmd: 'create_users' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //Get()
  //@UseGuards(JwtAuthGuard)
  //@MessagePattern({ cmd: 'findAll_users'})
  //@UseGuards(JwtAuthGuard)
  //findAll(@Payload()paginationDto: PaginationDto) {
  //return this.usersService.findAll(paginationDto);
  //}
  @MessagePattern('findAll_users')
  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
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
