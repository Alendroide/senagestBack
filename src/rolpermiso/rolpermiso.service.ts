import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolpermisoService {

  constructor(private prismaService: PrismaService) { }

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
    const rolePermisos = await this.prismaService.modulo.findMany({
      select: {
        id: true,
        nombre: true,
        icono: true,
        rutas: {
          include: {
            permisos: {
              select: {
                id: true,
                nombre: true,
                tipo: true
              }
            }
          }
        }
      }
    });

    const rolPermisosAsignados = await this.prismaService.rolPermiso.findMany({
      where: {
        rolId: rolId,
      },
      select: {
        permisoId: true,
        valor: true,
      },
    });

    const permisoMap = new Map(
      rolPermisosAsignados.map(({ permisoId, valor }) => [permisoId, valor])
    );

    const mappedPermisos = rolePermisos.map((module) => {
      const permisos = module.rutas.flatMap((ruta) =>
        ruta.permisos.map((permiso) => ({
          ...permiso,
          checked: permisoMap.get(permiso.id) ?? false,
        }))
      );

      return {
        ...module,
        permisos,
        rutas: undefined,
      };
    });


    return { status: 200, message: "Permisos by rol fetched successfully", data: mappedPermisos }
  }

  async getRoles() {
    const roles = await this.prismaService.rol.findMany();
    return { status: 200, message: "Roles fetched successfully", data: roles };
  }
}
