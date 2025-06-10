import { forwardRef, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, Rol } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { AuthService } from 'src/auth/auth.service';
import { RolEnum } from './enums/rol.enum';


@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UserService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super();
  }
  // async create(createUserDto: CreateUserDto) {
  //   const createUser = await this.usuarios.create({
  //     data: createUserDto
  //   });
  // }
  async create(registerUserDto: CreateUserDto) {
    const {
      usua_email,
      usua_nombre,
      usua_apellido,
      usua_celular,
      usua_direccion,
      usua_contrasenia,
      usua_ruc,
      usua_rol,
      activo,
      createdBy,
    } = registerUserDto;

    try {
      // Validar existencia previa de email o ruc
      const existingUser = await this.usuarios.findFirst({
        where: {
          OR: [
            { usua_email },
            { usua_ruc }
          ]
        }
      });

      if (existingUser) {
        throw new RpcException({
          status: 400,
          message: 'Ya existe un usuario con este correo o RUC.'
        });
      }

      // Crear nuevo usuario
      const newUser = await this.usuarios.create({
        data: {
          usua_email,
          usua_nombre,
          usua_apellido,
          usua_celular,
          usua_direccion,
          usua_contrasenia: bcrypt.hashSync(usua_contrasenia, 10),
          usua_ruc,
          usua_rol,
          activo,
          createdBy,  // si lo envías desde auth, aquí se usa
        }
      });

      const { usua_contrasenia: __, ...rest } = newUser;

      // Construir el payload del token
      const payload: JwtPayload = {
        id: rest.usua_id,
        email: rest.usua_email,
        name: `${rest.usua_nombre} ${rest.usua_apellido}`,
        rol: [rest.usua_rol]
      };

      return {
        user: rest,
        token: await this.authService.signJWT(payload),
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }


  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 50, search = '' } = paginationDto;

    const where: any = {
      activo: true,
    };

    if (search) {
      where.OR = [
        { usua_nombre: { contains: search, mode: 'insensitive' } },
        { usua_apellido: { contains: search, mode: 'insensitive' } },
        { usua_ruc: { contains: search, mode: 'insensitive' } },
        { usua_email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.usuarios.count({ where }),
      this.usuarios.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: {
          usua_nombre: 'asc',
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      metadata: {
        total,
        page,
        lastPage,
      },
    };
  }




  async findAllInactive(paginationDto: PaginationDto) {
    const { page = 1, limit = 50, search = '' } = paginationDto;

    const where: any = {
      activo: false,
    };

    if (search) {
      where.OR = [
        { usua_nombre: { contains: search, mode: 'insensitive' } },
        { usua_apellido: { contains: search, mode: 'insensitive' } },
        { usua_ruc: { contains: search, mode: 'insensitive' } },
        { usua_email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.usuarios.count({ where }),
      this.usuarios.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: {
          usua_nombre: 'asc',
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      metadata: {
        total,
        page,
        lastPage,
      },
    };
  }




  async findOne(usua_id: number) {
    //console.log(`🔍 [usuarios-ms] Iniciando búsqueda del usuario con ID: ${usua_id}`);

    try {
      const user = await this.usuarios.findUnique({
        where: {
          usua_id,
          //activo: true 
        },
      });

      if (!user) {
        console.error(`🚨 [usuarios-ms] Usuario con ID ${usua_id} no encontrado.`);
        throw new RpcException({
          message: `Usuario con ID ${usua_id} no encontrado.`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      //console.log(`✅ [usuarios-ms] Usuario encontrado:`, user);
      return user;

    } catch (error) {
      console.error(`❌ [usuarios-ms] Error al buscar usuario:`, error);
      throw new RpcException({
        message: `❌ Error interno en usuarios-ms (findOne)`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }


  async update(usua_id: number, updateUserDto: UpdateUserDto, updatedBy: number) {

    const { usua_id: __, ...data } = updateUserDto;
    await this.findOne(usua_id);

    const updatedUser = await this.usuarios.update({
      where: { usua_id },
      data: {
        ...data,
        updatedBy,
      }
    });

    return { user: updatedUser }
  }

  async remove(usua_id: number, updatedBy: number) {
    await this.findOne(usua_id);
    //return this.usuarios.delete({
    //  where: {usua_id}
    //});
    const user = await this.usuarios.update({
      where: { usua_id },
      data: {
        activo: false,
        updatedBy,
      }
    });
    return user
  }

  async findByEmail(usua_email: string) {
    return this.usuarios.findUnique({
      where: { usua_email },
    });
  }

  //***************************************************************************** */
  async findByRole(roles: Rol[]) {
    return this.usuarios.findMany({
      where: {
        usua_rol: {
          in: roles,
        }
        ,
      },
      select: {
        usua_id: true,
        usua_nombre: true,
        usua_apellido: true,
        usua_email: true,
        usua_rol: true,

      },
    });
  }


  async findByIds(ids: number[]) {
    return this.usuarios.findMany({
      where: {
        usua_id: { in: ids },
      },
    });
  }



  //***************************************************************************** */

  async listarUsuarios(filtros: { usua_email?: string; }) {
    return this.usuarios.findMany({
      where: {
        ...(filtros.usua_email ? { usua_email: filtros.usua_email } : {}),

      },
    });
  }



}
