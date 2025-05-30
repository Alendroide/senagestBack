
export type JwtPayload = {
    sub : number;
    identificacion : string;
    correo : string;
    img : string;
    rol : number | undefined;
    nombre : string;
}