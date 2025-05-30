import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramaDto } from './dto/create-programa.dto';

@Injectable()
export class ProgramasService {
    constructor( private prismaService : PrismaService){}
    
    async createPrograma(data : CreateProgramaDto){
        const programa = await this.prismaService.programa.create({
            data
        });
        return { status: 201, message: "Programa created successfully", data: programa };
    }

    async getProgramas(page: number){

        const records = 10;

        const programas = await this.prismaService.programa.findMany({
            take: records,
            skip: (page - 1) * records
        });

        const programaCount = await this.prismaService.programa.count();

        const totalPages = Math.ceil(programaCount / records);

        return { status: 200, message: "Programas fetched successfully", data: programas, currentPage: page, totalPages };
    }
}
