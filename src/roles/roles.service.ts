import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async createRol(data: CreateRolDto) {
      const newRole = await this.prismaService.rol.create({ data });
      return { status: 201, message: "Rol created successfully", data: newRole};
  }

  async getRoles(page: number) {
    const records = 10;

    const roles = await this.prismaService.rol.findMany({
      take: records,
      skip: (page - 1) * records
    });

    const roleCount = await this.prismaService.rol.count();

    const totalPages = Math.ceil(roleCount / records);

    return { status: 200, message: "Roles fetched successfully", data: roles, currentPage: page, totalPages };
  }

  async getAllRoles() {
    const roles = await this.prismaService.rol.findMany();
    return { status: 200, message: "Roles fetched successfully", data: roles };
  }

  async updateRol(id: number, data: UpdateRolDto){
    const updatedRol = await this.prismaService.rol.update({
      where: {
        id
      },
      data
    });
    return { status: 200, message: "Rol updated successfully", data: updatedRol };
  }

  async updateStatus(id: number) {
    return "In process";
  }

}
