import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolpermisoService {

    constructor(private prismaService: PrismaService){}

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
    const rolePermisos = await this.prismaService.permiso.findMany({
      where: {
        roles: {
          some: {
            AND: {
              rolId,
              valor: true
            }
          }
        }
      }
    })
    return { status: 200, message: "Permisos by rol fetched successfully", data: rolePermisos}
  }

  async getRoles(){
    const roles = await this.prismaService.rol.findMany();
    return { status: 200, message: "Roles fetched successfully", data: roles};
  }
}
