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


  //--------------- PERMISO ASIGNING ---------------//

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
