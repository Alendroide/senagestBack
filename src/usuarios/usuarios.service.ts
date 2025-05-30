import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(private prismaService: PrismaService) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async createUsuario(data: CreateUsuarioDto, file: Express.Multer.File | undefined): Promise<any> {
        // Validaciones
        const ficha = await this.prismaService.ficha.findUnique({
            where: { codigo: data.fichaId },
        });

        if (!ficha)
            throw new HttpException(
                { status: 404, message: 'Ficha not found.' },
                HttpStatus.NOT_FOUND,
            );

        // Password hashing
        const hash = await this.hashPassword(data.contrasena);

        // Crear en la base de datos
        await this.prismaService.usuario.create({
            data: { ...data, contrasena: hash, img: file ? `resize-${file.filename}` : undefined },
        });

        const newUser = await this.prismaService.usuario.findUnique({
            where: {
                identificacion: data.identificacion
            },
            select: {
                id: true,
                identificacion: true,
                primerNombre: true,
                primerApellido: true,
                segundoNombre: true,
                segundoApellido: true,
                correo: true,
                fichaId: true,
                rolId: true,
                fechaNacimiento: true,
                img: true
            }
        });

        const newUserParsed = {
            ...newUser,
            identificacion: `${newUser?.identificacion}`
        }

        return { status: 201, message: 'User registered successfully.', data: newUserParsed };
    }

    async getUsuarios(page: number) {

        const records = 10;

        const users = await this.prismaService.usuario.findMany({
            select: {
                id: true,
                img: true,
                identificacion: true,
                primerNombre: true,
                segundoNombre: true,
                primerApellido: true,
                segundoApellido: true,
                correo: true,
                fichaId: true
            },
            orderBy: {
                fichaId: 'asc'
            },
            take: records,
            skip: (page - 1) * records
        });

        const userCount = await this.prismaService.usuario.count();

        const totalPages = Math.ceil(userCount / records);

        const processedUsers = users.map((user) => ({
            ...user,
            identificacion: `${user.identificacion}`
        }))

        return { status: 200, message: "Users fetched successfully", data: processedUsers, currentPage: page, totalPages };
    }
}
