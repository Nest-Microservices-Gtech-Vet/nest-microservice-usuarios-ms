import { IsEnum, IsOptional } from 'class-validator';
import { Rol } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FiltroUsuariosDto {

    @IsOptional()
    @Expose()
    usua_email?: string;

    // @IsOptional()
    // @IsEnum(Rol)
    // @Expose()
    // usua_rol?: Rol;
}
