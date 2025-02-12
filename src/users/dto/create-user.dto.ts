import { Rol } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(10)
    @MaxLength(13)
    usua_ruc        :string;

    @IsString()
    usua_nombre     :string;   
    
    @IsString()
    usua_apellido   :string; 
    
    @IsString()
    @IsEmail()
    usua_email      :string; 
    
    @IsString()
    usua_celular    :string; 
    
    @IsString()
    usua_direccion  :string;    
    
    @IsString()
    @MinLength(4)
    usua_contrasenia:string;

    @IsEnum(Rol)
    usua_rol: Rol

    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    activo: boolean;

   
    @IsInt()
    createdBy?: number;

    
   
    @IsInt()
    updatedBy?: number;
}
