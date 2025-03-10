import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Injectable()
export class PermisosService {
    
    constructor(private prismaService : PrismaService){}

    async getPermisosByModule ( moduloId : number ) {
        const permisos = await this.prismaService.permiso.findMany({
            where : {
                moduloId
            }
        })
        return permisos;
    }

    async createPermiso (data : CreatePermisoDto) {
        const permiso = await this.prismaService.permiso.create({
            data
        });
        return { message : "Permiso created successfully", permiso };
    }

    async asignPermiso (permisoId : number, rolId : number, valor : boolean) {
        const newAsign = await this.prismaService.rolPermiso.create({
            data : {
                permisoId,
                rolId,
                valor
            }
        });
        return { message : "Permiso asigned successfully", newAsign};
    }
}
