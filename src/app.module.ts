import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ModulosModule } from './modulos/modulos.module';
import { PermisosModule } from './permisos/permisos.module';
import { ProgramasModule } from './programas/programas.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsuariosModule,
    ModulosModule,
    PermisosModule,
    ProgramasModule,
    RolesModule
  ],
})
export class AppModule {}
