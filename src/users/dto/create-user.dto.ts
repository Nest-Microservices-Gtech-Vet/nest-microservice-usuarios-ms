import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
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
    usua_contrasenia:string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    activo: boolean;
}
