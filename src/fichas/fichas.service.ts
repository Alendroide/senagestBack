import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FichasService {
    constructor(private prismaService : PrismaService) {}

    async getAllFichas() {
        const fichas = await this.prismaService.ficha.findMany();
        return {
        status: 200,
        message: 'Fichas found successfully',
        data: fichas,
        };
    }
}
