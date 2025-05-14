import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
    constructor(private prismaService : PrismaService){}

    async getAllUsers(page: number){
        const users = await this.prismaService.usuario.findMany({
            select: {
                identificacion: true,
                primerNombre: true,
                segundoNombre: true,
                primerApellido: true,
                segundoApellido: true,
                correo: true,
            },
            take: 40,
            skip: (page-1)*40
        });

        const processedUsers = users.map((user) => ({
            ...user,
            identificacion : `${user.identificacion}`
        }))

        return processedUsers;
    }
}
