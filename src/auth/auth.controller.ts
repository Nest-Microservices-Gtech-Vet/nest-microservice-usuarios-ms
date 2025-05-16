import { Controller, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @MessagePattern('auth.login.user')
  // loginUser(@Payload() loginUserDto: CreateUserDto) {
  //   return this.authService.loginUser(loginUserDto);
  // }

  @MessagePattern('auth.login.user')
  async login(@Payload() loginUserDto: LoginUserDto) {
    try {
      return this.authService.loginUser(loginUserDto);
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login interno falló');
    }
  }

  @MessagePattern('auth.verify.user')
  verifyToken( @Payload() token:string){
    //console.log('🔑 Token recibido en usuarios-ms (controller):', token); // Nuevo log
    return this.authService.verifyToken(token);
  }

  
}
