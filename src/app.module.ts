import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ModulosModule } from './modulos/modulos.module';
import { PermisosModule } from './permisos/permisos.module';
import { ProgramasModule } from './programas/programas.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesModule } from './roles/roles.module';
import { RolpermisoModule } from './rolpermiso/rolpermiso.module';
import { RutasModule } from './rutas/rutas.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsuariosModule,
    ModulosModule,
    PermisosModule,
    ProgramasModule,
    RolesModule,
    RolpermisoModule,
    RutasModule
  ],
})
export class AppModule {}
