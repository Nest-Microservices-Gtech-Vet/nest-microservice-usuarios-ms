import { Rol } from "@prisma/client";

export interface JwtPayload {
    id:number;
    email: string;
    name: string;
    rol: Rol[];

}