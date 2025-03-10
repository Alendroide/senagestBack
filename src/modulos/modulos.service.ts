import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class ModulosService {
    
    constructor(private prismaService : PrismaService) {}

    async getModulos() : Promise<any> {
        return await this.prismaService.modulo.findMany();
    }

    async createModulo(data : CreateModuloDto) : Promise<any> {
        await this.prismaService.modulo.create({ data });
        return { message : "Modulo created successfully." };
    }
}
