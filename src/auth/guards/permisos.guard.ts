import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISO_KEY } from '../decorators/permisos.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permisos: number[] = this.reflector.get<number[]>(PERMISO_KEY, context.getHandler());

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new HttpException("Not logged in", HttpStatus.UNAUTHORIZED);

    if (!permisos || permisos.length === 0) return true;

    const permisosDelRol = await this.prismaService.rolPermiso.findMany({
      where: {
        rolId: user.rol,
        permisoId: { in: permisos },
        valor: true,
        permiso: {
          estado: true
        },
        rol: {
          estado: true
        }
      },
    });

    if (permisosDelRol.length > 0) return true;

    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
