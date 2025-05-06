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

  @MessagePattern({ cmd: 'create_users' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //Get()F

  @MessagePattern({ cmd: 'findAll_users' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  //@Get(':id')

  @MessagePattern({ cmd: 'findOne_users' })
  async findOne(@Payload('id', ParseIntPipe) usua_id: number) {
    return this.usersService.findOne(usua_id)

  }






  //@Patch(':id')

  @MessagePattern({ cmd: 'update_users' })
  update(
    @Payload() updateUserDto: UpdateUserDto
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
