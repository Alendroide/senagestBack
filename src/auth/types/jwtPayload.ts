export type Module = {
    nombre : string;
    icono : string;
}

export type JwtPayload = {
    sub : number;
    identificacion : string;
    correo : string;
    rol : string | undefined;
    nombre : string;
    modulos : Module[]
}