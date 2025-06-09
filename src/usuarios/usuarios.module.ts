import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService,PrismaService,ConfigService]
})
export class UsuariosModule {}
