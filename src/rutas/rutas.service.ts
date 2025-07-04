import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Injectable()
export class RutasService {
  constructor(private prismaService: PrismaService) {}

  async createRuta(data: CreateRutaDto) {
    const newRuta = await this.prismaService.rutaFront.create({ data });
    return { status: 201, message: 'Ruta created successfully', data: newRuta };
  }

  async getRutasByModule(id: number, page: number, search?: string) {
    const records = 10;

    const rutas = await this.prismaService.modulo.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        icono: true,
        rutas: {
          where: search ? {nombre: {contains: search}} : {},
          select: {
            id: true,
            nombre: true,
            ruta: true,
            estado: true,
          },
          take: records,
          skip: (page - 1) * records,
        },
      },
    });

    const rutasCount = await this.prismaService.rutaFront.count({
      where: {
        moduloId: 1,
      },
    });

    const totalPages = Math.ceil(rutasCount / records);

    return {
      status: 200,
      message: 'Rutas fetched successfully',
      data: rutas,
      currentPage: page,
      totalPages,
    };
  }

  async getAllRutasByModule(id: number) {
    const rutas = await this.prismaService.rutaFront.findMany({
      where: {
        moduloId: id,
      },
    });
    return {
      status: 200,
      message: 'Rutas found successfully',
      data: rutas,
    };
  }

  async getModules() {
    const modules = await this.prismaService.modulo.findMany();
    return {
      status: 200,
      message: 'Modules found successfully',
      data: modules,
    };
  }

  async updateRuta(id: number, data: UpdateRutaDto) {
    const existingRuta = await this.prismaService.rutaFront.findUnique({
      where: { id },
    });
    if (!existingRuta) throw new Error('Ruta not found');
    const updatedRuta = await this.prismaService.rutaFront.update({
      where: { id },
      data,
    });
    return {
      status: 200,
      message: 'Ruta updated successfully',
      data: updatedRuta,
    };
  }

  async updateStatus(id: number) {
    const existingRuta = await this.prismaService.rutaFront.findUnique({
      where: {
        id
      }
    });
    if (!existingRuta) throw new HttpException({ status: 404, message: "Ruta not found" }, HttpStatus.NOT_FOUND);

    const updatedRuta = await this.prismaService.rutaFront.update({
      where: {
        id
      },
      data: {
        estado: !existingRuta.estado
      }
    })

    return { status: 200, message: "status updated successfully", data: updatedRuta };
  }
}
