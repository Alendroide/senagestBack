import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
    
    constructor(private prismaService : PrismaService) {}

    async createModulo(data : CreateModuloDto) {
        const newModulo = await this.prismaService.modulo.create({ data });
        return { status: 201, message : "Modulo created successfully.", data: newModulo };
    }

    async getModulos() {
        const modulos = await this.prismaService.modulo.findMany();
        return { status: 200, message: "Modulos fetched successfully", data: modulos};
    }

    async updateModulo(id: number, data: UpdateModuloDto) {
        const updatedModulo = await this.prismaService.modulo.update({
            where: {
                id
            },
            data
        })
        return { status: 200, message: "Modulo updated succesfully", data: updatedModulo};
    }

    async updateStatus(id: number) {
        return "In process";
    }
}
