import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login-superadmin' })  // <--- Agregar esto
  handleLoginSuperAdmin(body: { email: string, password: string }) {
    return this.authService.loginSuperAdmin(body.email, body.password);
  }

  @MessagePattern({ cmd: 'login-admin' })  // <--- También para el admin
  handleLoginAdmin(body: { ruc: string, password: string }) {
    return this.authService.loginAdmin(body.ruc, body.password);
  }
}
