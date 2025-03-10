import { IsString, IsNotEmpty, IsEmail, MinLength, IsNumber, IsDateString, IsOptional, IsISO8601 } from "class-validator";

export class CreateUsuarioDto {

    @IsNumber()
    @IsNotEmpty()
    identificacion : number;

    @IsString()
    @IsNotEmpty()
    primerNombre: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    segundoNombre?: string;

    @IsString()
    @IsNotEmpty()
    primerApellido: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    segundoApellido?: string;

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    contrasena: string;

    @IsNotEmpty()
    @IsISO8601()
    fechaNacimiento: Date;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    fichaId?: number;

    @IsString()
    @IsNotEmpty()
    img: string;
}