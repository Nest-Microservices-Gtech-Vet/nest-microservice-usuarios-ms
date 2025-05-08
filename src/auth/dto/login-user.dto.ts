import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsEmail()
    usua_email:string;

    @IsString()
    @IsNotEmpty()
    usua_contrasenia: string;
}