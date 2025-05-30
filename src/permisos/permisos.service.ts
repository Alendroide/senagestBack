import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisosService {

  constructor(private prismaService: PrismaService) {}

  async createPermiso(data: CreatePermisoDto) {
    const permiso = await this.prismaService.permiso.create({data});
    return { status: 201, message: 'Permiso created successfully', data: permiso };
  }

  async getPermisos() {
    const permisos = await this.prismaService.modulo.findMany({
      select: {
        id: true,
        nombre: true,
        icono: true,
        rutas: {
          select: {
            permisos: true
          }
        }
      },
    });
    return { status: 200, message: "Permisos fetched successfully", data: permisos};
  }

  async updatePermiso(id: number, data: UpdatePermisoDto) {
    const updatedPermiso = await this.prismaService.permiso.update({
      where: {
        id
      },
      data
    })
    return { status: 200, message: "Permiso updated successfully", data: updatedPermiso };
  }

  async updateStatus(id: number) {
    return "In process";
  }

}
