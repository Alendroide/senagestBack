import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
    constructor(private prismaService : PrismaService){}

    async getAllUsers(page: number){

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
            skip: (page-1)*numberOfUsersPerPage
        });

        const userCount = await this.prismaService.usuario.count();

        const flooredPages = Math.floor(userCount / numberOfUsersPerPage);

        const pagesCount = userCount % numberOfUsersPerPage === 0 ? flooredPages : flooredPages + 1 ;

        const processedUsers = users.map((user) => ({
            ...user,
            identificacion : `${user.identificacion}`
        }))

        return {status: 200, message: "Users fetched successfully", data: processedUsers, currentPage: page, totalPages: Math.floor(pagesCount)};
    }
}
