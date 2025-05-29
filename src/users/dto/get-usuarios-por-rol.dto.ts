import { IsEnum } from 'class-validator';
import { RolEnum } from '../enums/rol.enum';
import { Expose } from 'class-transformer';

export class GetUsuariosPorRolDto {
  @Expose()
  @IsEnum(RolEnum, { message: 'Rol inválido' })
  usua_rol: RolEnum;
}