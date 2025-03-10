import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaService } from './prisma/prisma.service';
import { ModulosModule } from './modulos/modulos.module';

@Module({
  imports: [AuthModule, UsuariosModule, ModulosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
