import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(@Payload() data: { email?: string; ruc?: string; password: string }) {
    console.log('📩 Datos recibidos para login:', data);

    const user = await this.authService.validateUser(data);

    // Devuelve el token correctamente
    return { access_token: user.access_token };
  }
}
