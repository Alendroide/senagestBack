import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ModulosModule } from './modulos/modulos.module';
import { PermisosModule } from './permisos/permisos.module';
import { ProgramasModule } from './programas/programas.module';

@Module({
  imports: [AuthModule, UsuariosModule, ModulosModule, PermisosModule, ProgramasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
