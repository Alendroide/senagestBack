import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(private prismaService: PrismaService) {}

  async createPermiso(data: CreatePermisoDto) {
    const permiso = await this.prismaService.permiso.create({ data });
    return {
      status: 201,
      message: 'Permiso created successfully',
      data: permiso,
    };
  }

  async getPermisos(id: number, page: number) {

    const records = 10;
    const skip = ( page - 1 ) * records;

    const permisos = await this.prismaService.modulo.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        icono: true,
        nombre: true,
        rutas: {
          select: {
            permisos: true,
          },
        },
      },
    });

    // Mapeo para obtener ÚNICAMENTE LOS PERMISOS ignorando las rutas
    const mappedPermisos = permisos?.rutas.flatMap((ruta) => ruta.permisos) || [];
    
    // Paginación manual
    const permisosCount = mappedPermisos.length;
    const paginatedPermisos = mappedPermisos.slice(skip, skip + records);

    const completeInfo = {
      ...permisos,
      rutas: undefined,
      permisos: paginatedPermisos,
    }

    return {
      status: 200,
      message: 'Permisos fetched successfully',
      data: completeInfo,
      currentPage: page,
      totalPages: Math.ceil(permisosCount / records),
    };
  }

  async updatePermiso(id: number, data: UpdatePermisoDto) {
    const updatedPermiso = await this.prismaService.permiso.update({
      where: {
        id,
      },
      data,
    });
    return {
      status: 200,
      message: 'Permiso updated successfully',
      data: updatedPermiso,
    };
  }

  async updateStatus(id: number) {
      const existingPermiso = await this.prismaService.permiso.findUnique({
          where: {
              id
          }
      });
      if(!existingPermiso) throw new HttpException({ status: 404, message: "Permiso not found" }, HttpStatus.NOT_FOUND);

      const updatedPermiso = await this.prismaService.permiso.update({
          where: {
              id
          },
          data: {
              estado: !existingPermiso.estado
          }
      })

      return { status: 200, message: "status updated successfully", data: updatedPermiso};
  }
}
