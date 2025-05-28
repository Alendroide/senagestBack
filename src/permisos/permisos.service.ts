import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(private prismaService: PrismaService) {}

  async getPermisosCategorized() {
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

  async getPermisosByModulo(moduloId: number) {
    const permisos = await this.prismaService.permiso.findMany({
      where: {
        ruta: {
          moduloId
        },
      },
    });
    return { status: 200, message: 'Permisos fetched successfully', data: permisos};
  }

  async createPermiso(data: CreatePermisoDto) {

    const permiso = await this.prismaService.permiso.create({
      data
    });

    return { status: 200, message: 'Permiso created successfully', data: permiso };
  }

  async asignPermiso(permisoId: number, rolId: number, valor: boolean) {
    const [existingPermiso] = await this.prismaService.rolPermiso.findMany({
      where: {
        rolId,
        permisoId,
      },
    });

    if (!existingPermiso) {
      const newAsign = await this.prismaService.rolPermiso.create({
        data: {
          permisoId,
          rolId,
          valor,
        },
      });
      return { status: 201, message: 'Permiso asigned successfully', data: newAsign };
    } else {
      const updatedAsign = await this.prismaService.rolPermiso.updateMany({
        data: { valor },
        where: {
          rolId,
          permisoId,
        },
      });
      return { status: 200, message: 'Permiso asigned successfully', data: updatedAsign };
    }
  }

  async getRolePermisos(rolId: number) {
    return "In process"
  }

  async getRoles(){
    return "In process"
  }

  async myPermisos(usuarioId: number) {
    return "In process"
  }

  async myPermisosByModulo(usuarioId: number, moduloId: number) {
    return "In process"
  }
}
