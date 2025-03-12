import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramaDto } from './dto/create-programa.dto';

@Injectable()
export class ProgramasService {
    constructor( private prismaService : PrismaService){}

    async getProgramas(){
        return await this.prismaService.programa.findMany();
    }

    async createPrograma(data : CreateProgramaDto){
        const programa = await this.prismaService.programa.create({
            data
        });
        return { message : "Programa created successfully", programa };
    }
}
