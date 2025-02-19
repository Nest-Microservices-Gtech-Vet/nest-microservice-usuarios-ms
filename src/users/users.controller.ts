import { Controller, Body, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {  PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@Post()
  @MessagePattern({ cmd: 'create_users'})
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //Get()
  @MessagePattern({ cmd: 'findAll_users'})
  findAll(@Payload()paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'findOne_users'})
  async findOne(@Payload() data: any){
    console.log('🔍 Recibida petición para buscar usuario:', data);
    return this.usersService.findOne(data.usua_id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_users'})
  update(
    //@Param('id', ParseIntPipe) usua_id: number, 
    //@Body() updateUserDto: UpdateUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    
    return this.usersService.update(updateUserDto.usua_id, updateUserDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_users'})
  remove(@Payload('usua_id', ParseIntPipe) usua_id: number) {
    const ue = usua_id;
    console.log(`el usuario ${ue} a sido eliminado`)
    return this.usersService.remove(usua_id);
    
  }
}
