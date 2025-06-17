import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    primerNombre: string;

    @IsString()
    @IsOptional()
    segundoNombre?: string;

    @IsString()
    @IsNotEmpty()
    primerApellido: string;

    @IsString()
    @IsOptional()
    segundoApellido?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    fichaId?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    rolId?: number;

}