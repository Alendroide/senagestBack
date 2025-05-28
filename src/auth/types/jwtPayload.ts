export type Permiso = {
    nombre: string;
    tipo: string;
}

export type RutaFront = {
    nombre: string;
    ruta: string;
    permisos: Permiso[];
}

export type Modulo = {
    nombre : string;
    icono : string;
    rutas: RutaFront[]
}

export type JwtPayload = {
    sub : number;
    identificacion : string;
    correo : string;
    img : string;
    rol : number | undefined;
    nombre : string;
    modulos : Modulo[]
}