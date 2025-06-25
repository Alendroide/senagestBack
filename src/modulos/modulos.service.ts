import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async getModulos(page: number) {

        const records = 10;

        const modulos = await this.prismaService.modulo.findMany({
            take: records,
            skip: (page - 1) * records
        });

        const moduloCount = await this.prismaService.modulo.count();

        const totalPages = Math.ceil(moduloCount / records);

        return { status: 200, message: "Modulos fetched successfully", data: modulos, currentPage: page, totalPages };
    }

    async getAllModulos() {
        const modules = await this.prismaService.modulo.findMany();
        return {
        status: 200,
        message: 'Modules found successfully',
        data: modules,
        };
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
        const existingModulo = await this.prismaService.modulo.findUnique({
            where: {
                id
            }
        });
        if(!existingModulo) throw new HttpException({ status: 404, message: "Modulo not found" }, HttpStatus.NOT_FOUND);

        const updatedModulo = await this.prismaService.modulo.update({
            where: {
                id
            },
            data: {
                estado: !existingModulo.estado
            }
        })

        return { status: 200, message: "status updated successfully", data: updatedModulo};
    }
}
