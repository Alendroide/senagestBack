import { Module } from '@nestjs/common';
import { RolpermisoService } from './rolpermiso.service';
import { RolpermisoController } from './rolpermiso.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RolpermisoController],
  providers: [RolpermisoService,PrismaService],
})
export class RolpermisoModule {}
