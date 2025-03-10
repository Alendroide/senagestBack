import { tipoPermiso } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePermisoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    nombre : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    descripcion : string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsEnum(tipoPermiso)
    tipo? : tipoPermiso

    @IsNotEmpty()
    @IsNumber()
    moduloId : number
}