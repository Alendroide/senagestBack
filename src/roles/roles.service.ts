import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async createRole(data: CreateRolDto) {
      const newRole = await this.prismaService.rol.create({ data });
  }

  async getRoles() {
    return await this.prismaService.rol.findMany();
  }

}
