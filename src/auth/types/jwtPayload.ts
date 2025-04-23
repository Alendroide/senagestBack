export type permiso = {
    rutafront : {
        ruta : string,
        nombre : string
    }
}

export type Module = {
    nombre : string;
    icono : string;
    permisos : permiso[];
}

export type JwtPayload = {
    sub : number;
    identificacion : string;
    correo : string;
    rol : number | undefined;
    nombre : string;
    modulos : Module[]
}