import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class ModulosService {
    
    constructor(private prismaService : PrismaService) {}

    async getModulos() : Promise<any> {
        const modulos = await this.prismaService.modulo.findMany();
        return { status: 200, message: "Modulos fetched successfully", data: modulos};
    }

    async createModulo(data : CreateModuloDto) : Promise<any> {
        const newModulo = await this.prismaService.modulo.create({ data });
        return { status: 201, message : "Modulo created successfully.", data: newModulo };
    }
}
