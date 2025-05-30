export type Permiso = {
    id: number;
    nombre: string;
    tipo: string;
}

export type RutaFront = {
    id: number;
    nombre: string;
    ruta: string;
    permisos: Permiso[];
}

export type Modulo = {
    id: number;
    nombre : string;
    icono : string;
    rutas: RutaFront[]
}