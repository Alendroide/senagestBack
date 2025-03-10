import { Module } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { ModulosController } from './modulos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ModulosService, PrismaService],
  controllers: [ModulosController]
})
export class ModulosModule {}
