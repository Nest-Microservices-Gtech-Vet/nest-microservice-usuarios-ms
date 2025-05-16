import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt'
import { envs } from 'src/config';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('AuhtUser-MS')
    onModuleInit() {
        this.$connect();
        this.logger.log('Base de Datos conectada desde Auth');
    }

    constructor(
        private readonly jwtservice: JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

    ) {
        super();
    }

    async signJWT(Payload: JwtPayload) {
        return this.jwtservice.sign(Payload)
    }

    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtservice.verify(token, {
                secret: envs.jwtSecret,
            });

            const userWithRoleArray = {
                ...user,
                rol: Array.isArray(user.rol) ? user.rol : [user.usua_rol],
            };

            return {
                user: userWithRoleArray,
                token: await this.signJWT(userWithRoleArray),
            }
        } catch (error) {
            console.log(error)
            throw new RpcException({
                status: 401,
                message: 'Token Invalido'
            })
        }

    }

    async loginUser(loginUserDto: LoginUserDto) {
        const { usua_email, usua_contrasenia } = loginUserDto
        try {
            const user = await this.usersService.findByEmail(usua_email);
            if (!user || !user.activo) {
                throw new RpcException({
                    status: 400,
                    message: 'Usuario no valido - email'
                });

            }

            const isPasswordValid = bcrypt.compareSync(usua_contrasenia, user.usua_contrasenia)
            if (!isPasswordValid) {
                throw new RpcException({
                    status: 400,
                    message: 'clave no validos'
                })
            }

            const { usua_contrasenia: __, ...rest } = user;

            const payload: JwtPayload = {
                id: user.usua_id,
                email: user.usua_email,
                name: `${user.usua_nombre} ${user.usua_apellido}`,
                rol: [user.usua_rol],
            };

            return {
                user: {
                    usua_id: user.usua_id,
                    usua_email: user.usua_email,
                    usua_nombre: user.usua_nombre,
                    usua_apellido: user.usua_apellido,
                    usua_rol: user.usua_rol,
                },
                token: await this.signJWT(payload),
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
}
