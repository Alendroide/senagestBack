import { Injectable } from '@nestjs/common';
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

  async getRutas(id: number, page: number) {
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
          select: {
            id: true,
            nombre: true,
            ruta: true,
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
    return 'In process';
  }
}
