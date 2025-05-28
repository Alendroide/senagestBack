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
            data: { ...data, contrasena: hash, img: file ? file.filename : undefined },
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

        return { status: 201, message: 'User registered successfully.', data: newUser };
    }

    async getUsuarios(page: number) {

        const numberOfUsersPerPage = 10;

        const users = await this.prismaService.usuario.findMany({
            select: {
                identificacion: true,
                primerNombre: true,
                segundoNombre: true,
                primerApellido: true,
                segundoApellido: true,
                correo: true,
            },
            take: numberOfUsersPerPage,
            skip: (page - 1) * numberOfUsersPerPage
        });

        const userCount = await this.prismaService.usuario.count();

        const flooredPages = Math.floor(userCount / numberOfUsersPerPage);

        const pagesCount = userCount % numberOfUsersPerPage === 0 ? flooredPages : flooredPages + 1;

        const processedUsers = users.map((user) => ({
            ...user,
            identificacion: `${user.identificacion}`
        }))

        return { status: 200, message: "Users fetched successfully", data: processedUsers, currentPage: page, totalPages: Math.floor(pagesCount) };
    }
}
