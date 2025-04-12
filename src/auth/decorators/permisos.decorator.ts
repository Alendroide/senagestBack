import { SetMetadata } from "@nestjs/common";

export const PERMISO_KEY = 'permiso';
export const Permiso = (permiso : number) => SetMetadata(PERMISO_KEY, permiso);